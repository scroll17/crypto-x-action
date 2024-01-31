import { Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateResultEntity } from '@common/entities';
import { FindIntegrationDto } from './dto';
import { Integration, IntegrationModel, IntegrationEntity, IntegrationDocument } from '@schemas/integration';

@Injectable()
export class IntegrationService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Integration.name) private readonly integrationModel: IntegrationModel,
  ) {}

  public async getAll(dto: FindIntegrationDto): Promise<PaginateResultEntity<IntegrationEntity>> {
    this.logger.debug('Get all integrations', { ...dto });

    const integrations = await this.integrationModel.paginate(dto);

    this.logger.debug('Integrations selection result:', {
      meta: integrations.meta,
    });

    return integrations;
  }

  public async getById(id: Types.ObjectId): Promise<IntegrationDocument> {
    this.logger.debug('Get integration by id', {
      id,
    });

    const integration = await this.integrationModel.findById(id).exec();
    if (!integration) {
      throw new HttpException('Integration not found', HttpStatus.NOT_FOUND);
    }

    return integration;
  }
}
