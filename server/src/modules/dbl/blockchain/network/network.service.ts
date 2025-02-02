import { Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginateResultEntity } from '@common/entities';
import { InjectModel } from '@nestjs/mongoose';
import {
  BlockchainNetwork,
  BlockchainNetworkModel,
  BlockchainNetworkEntity,
  BlockchainNetworkDocument,
} from 'src/database/schemas/blockcain/network';
import { FindBlockchainNetworkDto } from './dto';

@Injectable()
export class BlockchainNetworkService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(BlockchainNetwork.name) private readonly blockchainNetworkModel: BlockchainNetworkModel,
  ) {}

  public async getAll(dto: FindBlockchainNetworkDto): Promise<PaginateResultEntity<BlockchainNetworkEntity>> {
    this.logger.debug('Get all blockchain networks', { ...dto });

    const networks = await this.blockchainNetworkModel.paginate(dto);

    this.logger.debug('Blockchain networks selection result:', {
      meta: networks.meta,
    });

    return networks;
  }

  public async getById(id: Types.ObjectId): Promise<BlockchainNetworkDocument> {
    this.logger.debug('Get blockchain network by id', {
      id,
    });

    // TODO: load network with details such as fee and other
    // TODO: load accounts from the network

    const network = await this.blockchainNetworkModel.findById(id).exec();
    if (!network) {
      throw new HttpException('Blockchain network not found', HttpStatus.NOT_FOUND);
    }

    return network;
  }
}
