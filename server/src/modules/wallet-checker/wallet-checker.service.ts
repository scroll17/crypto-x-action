import * as _ from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Integration, IntegrationModel } from '@schemas/integration';
import { AppConstants } from '../../app.constants';
import { BlockchainNetworkName } from '@common/blockchain/enums';

@Injectable()
export class WalletCheckerService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Integration.name) private readonly integrationModel: IntegrationModel,
  ) {}

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

    const integrationNetworkMap = new Map(
      Object.entries(_.invert(AppConstants.Integration.WALLET_CHECKER_INTEGRATIONS)).filter(([key]) =>
        Boolean(key),
      ),
    );

    const networks = integrations.map((i) => integrationNetworkMap.get(i.key)).filter(Boolean);
    return networks as BlockchainNetworkName[];
  }
}
