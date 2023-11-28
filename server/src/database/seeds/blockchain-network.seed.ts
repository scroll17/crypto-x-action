import { Command } from 'nestjs-command';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { BlockchainNetwork, BlockchainNetworkModel } from 'src/database/schemas/blockcain/network';
import { BlockchainNetworks } from '@common/blockchain/enums';

@Injectable()
export class BlockchainNetworkSeed {
  private readonly logger = new Logger(this.constructor.name);

  private readonly networks = [
    {
      name: BlockchainNetworks.Ethereum,
      description: `The Ethereum network`,
    },
    {
      name: BlockchainNetworks.StarkNet,
      description: `The StarkNet network`,
    },
  ];

  constructor(
    private configService: ConfigService,
    @InjectModel(BlockchainNetwork.name) private blockchainNetworkModel: BlockchainNetworkModel,
  ) {}

  @Command({ command: 'create:blockchain-networks', describe: 'create blockchain networks' })
  async createBulk() {
    this.logger.debug('Generating bulk of Blockchain networks');
    await Promise.all(
      this.networks.map(async (network) => {
        let dbNetwork = await this.blockchainNetworkModel
          .findOne({
            name: network.name,
          })
          .exec();
        if (dbNetwork) {
          this.logger.verbose('Blockchain network already exists', {
            name: dbNetwork.name,
          });
          return;
        }

        this.logger.debug('Creating Blockchain network with data', {
          name: network.name,
          description: network.description,
        });
        dbNetwork = await this.blockchainNetworkModel.create({ ...network });

        this.logger.verbose('Created Blockchain network', {
          name: dbNetwork.name,
        });
      }),
    );
  }
}
