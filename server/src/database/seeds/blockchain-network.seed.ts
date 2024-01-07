import _ from 'lodash';
import { Command } from 'nestjs-command';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { BlockchainNetwork, BlockchainNetworkModel } from 'src/database/schemas/blockcain/network';
import { IBlockchainNetworkEnvConfig } from '@common/blockchain/types/env-config';

@Injectable()
export class BlockchainNetworkSeed {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private configService: ConfigService,
    @InjectModel(BlockchainNetwork.name) private blockchainNetworkModel: BlockchainNetworkModel,
  ) {}

  @Command({ command: 'create:blockchain-networks', describe: 'create blockchain networks' })
  async createBulk() {
    const networks =
      this.configService.getOrThrow<Record<string, IBlockchainNetworkEnvConfig>>('blockchainNetworks');
    const networksInnerKeys = Object.keys(networks);

    this.logger.debug('Generating bulk of Blockchain networks', {
      networks: networksInnerKeys,
    });

    for (const [innerKey, networkConfig] of Object.entries(networks)) {
      let dbNetwork = await this.blockchainNetworkModel
        .findOne({
          innerKey,
        })
        .exec();
      if (dbNetwork) {
        this.logger.verbose('Blockchain network already exists. Update existed record', {
          innerKey,
          localName: dbNetwork.localName,
          id: dbNetwork._id,
        });

        dbNetwork.family = networkConfig.family;
        dbNetwork.localName = networkConfig.localName;
        dbNetwork.description = networkConfig.description;

        dbNetwork.name = networkConfig.details.name;
        dbNetwork.prototypeLevel = networkConfig.details.prototypeLevel;
        dbNetwork.currencySymbol = networkConfig.details.currencySymbol;
        dbNetwork.networkId = networkConfig.details.networkId;
        dbNetwork.scan = networkConfig.details.scan;

        dbNetwork.httpConnect = {
          ...networkConfig.connect.http,
          connectOptions: JSON.stringify(networkConfig.connect.http.connectOptions),
        };
        dbNetwork.socketConnect = networkConfig.connect.socket
          ? {
              ...networkConfig.connect.socket,
              connectOptions: JSON.stringify(networkConfig.connect.socket.connectOptions),
            }
          : null;

        dbNetwork.available = true;
        dbNetwork.removedAt = null;

        await dbNetwork.save();
        continue;
      }

      this.logger.debug('Creating Blockchain network with data', {
        innerKey,
        localName: networkConfig.localName,
      });

      dbNetwork = await this.blockchainNetworkModel.create({
        ..._.pick(networkConfig, ['family', 'localName', 'description']),
        ...networkConfig.details,
        innerKey,
        httpConnect: {
          ...networkConfig.connect.http,
          connectOptions: JSON.stringify(networkConfig.connect.http.connectOptions),
        },
        socketConnect: networkConfig.connect.socket
          ? {
              ...networkConfig.connect.socket,
              connectOptions: JSON.stringify(networkConfig.connect.socket.connectOptions),
            }
          : null,
        available: true,
        removedAt: null,
      });

      this.logger.verbose('Created Blockchain network', {
        innerKey,
        localName: networkConfig.localName,
        id: dbNetwork._id,
      });
    }

    await this.markAsRemoved(networksInnerKeys);
  }

  async markAsRemoved(innerKeys: string[]) {
    const allNetworksInDB = await this.blockchainNetworkModel.find().exec();
    const allNetworksInDBMap = new Map(allNetworksInDB.map((network) => [network.innerKey, network]));

    const removedNetworkKeys = _.difference([...allNetworksInDBMap.keys()], innerKeys);
    this.logger.debug('Mark as deleted Blockchain networks', {
      removedNetworks: removedNetworkKeys,
    });

    await Promise.all(
      removedNetworkKeys.map(async (removedInnerKey) => {
        this.logger.verbose('Mark as removed Blockchain network', {
          innerKey: removedInnerKey,
        });

        await this.blockchainNetworkModel.updateOne(
          {
            innerKey: removedInnerKey,
          },
          {
            $set: {
              removedAt: new Date(),
              available: false,
            },
          },
        );
      }),
    );
  }
}
