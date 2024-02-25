import * as _ from 'lodash';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Integration, IntegrationModel } from '@schemas/integration';
import { AppConstants } from '../../app.constants';
import { BlockchainNetworkName } from '@common/blockchain/enums';
import { IntegrationNames } from '@common/integrations/common';
import { BaseBlockScoutService } from '@integrations/base-block-scout/base-block-scout.service';
import { ScrollBlockScoutService } from '@integrations/scroll-block-scout/scroll-block-scout.service';
import { LineaExplorerService } from '@integrations/linea-explorer/linea-explorer.service';
import { ZkSyncBlockExplorerService } from '@integrations/zk-sync-block-explorer/zk-sync-block-explorer.service';
import { CryptoCompareService } from '@integrations/crypto-compare/crypto-compare.service';
import { AbstractBlockchainExplorerIntegration } from '@integrations/_utils/abstract-blockchain-explorer-integration';

type TIntegrationServices =
  | BaseBlockScoutService
  | ScrollBlockScoutService
  | LineaExplorerService
  | ZkSyncBlockExplorerService;

@Injectable()
export class WalletInspectorService {
  private readonly logger = new Logger(this.constructor.name);

  private readonly INTEGRATIONS_NETWORK_MAP = new Map(
    Object.entries(_.invert(AppConstants.Integration.WALLET_CHECKER_INTEGRATIONS)).filter(([key]) =>
      Boolean(key),
    ),
  );
  private readonly INTEGRATION_SERVICES_MAP = new Map<IntegrationNames, TIntegrationServices>();

  constructor(
    private readonly configService: ConfigService,
    private readonly cryptoCompareService: CryptoCompareService,
    private readonly baseBlockScoutService: BaseBlockScoutService,
    private readonly scrollBlockScoutService: ScrollBlockScoutService,
    private readonly lineaExplorerService: LineaExplorerService,
    private readonly zkSyncBlockExplorerService: ZkSyncBlockExplorerService,
    @InjectModel(Integration.name) private readonly integrationModel: IntegrationModel,
  ) {
    const integrationsMap: Array<[IntegrationNames, TIntegrationServices]> = [
      [IntegrationNames.BaseBlockScout, this.baseBlockScoutService],
      [IntegrationNames.ScrollBlockScout, this.scrollBlockScoutService],
      [IntegrationNames.LineaExplorer, this.lineaExplorerService],
      [IntegrationNames.ZkSyncBlockExplorer, this.zkSyncBlockExplorerService],
    ];
    integrationsMap.map(([name, service]) => this.INTEGRATION_SERVICES_MAP.set(name, service));
  }

  public async getNetworks(onlyActive = true) {
    this.logger.debug('Get all available networks', {
      onlyActive,
    });

    const integrationNames = Object.values(AppConstants.Integration.WALLET_CHECKER_INTEGRATIONS).filter(
      Boolean,
    );
    const integrations = await this.integrationModel
      .find({
        key: {
          $in: integrationNames,
        },
        ...(onlyActive ? { active: true } : {}),
      })
      .exec();

    this.logger.debug('Integrations selection result:', {
      count: integrations.length,
    });

    const networks = integrations.map((i) => this.INTEGRATIONS_NETWORK_MAP.get(i.key)).filter(Boolean);
    return networks as BlockchainNetworkName[];
  }

  public async buildTransactionsReport(network: BlockchainNetworkName, addresses: string[]) {
    const integrationName = AppConstants.Integration.WALLET_CHECKER_INTEGRATIONS[network];
    if (!integrationName) {
      throw new HttpException('Integration by Network not implemented', HttpStatus.BAD_REQUEST);
    }

    const integrationService = this.INTEGRATION_SERVICES_MAP.get(
      integrationName,
    ) as AbstractBlockchainExplorerIntegration;
    if (!integrationService) {
      throw new HttpException('Integration by Network not available', HttpStatus.BAD_REQUEST);
    }

    const ethPrice = await this.cryptoCompareService.getPrice('ETH', 'USD', false);
    if (!ethPrice) {
      throw new HttpException('Cannot load ETH price', HttpStatus.SERVICE_UNAVAILABLE);
    }

    return await integrationService.getMultipleAddressesReport(addresses, ethPrice);
  }
  /**
   *    TODO:
   *      1. convert reports
   *      2. return reports
   *      3. return mapper object:
   *        {
   *          'eth': ['ETH', 'ETH']
   *          'dContracts': ['D Contracts', 'Deployed Contracts'] (table column name, on focus text)
   *        }
   * */
}
