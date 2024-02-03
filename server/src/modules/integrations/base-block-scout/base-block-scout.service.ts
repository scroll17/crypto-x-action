import { firstValueFrom } from 'rxjs';
import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { IntegrationNames } from '@common/integrations/common';
import { Integration, IntegrationDocument, IntegrationModel } from '@schemas/integration';
import { BaseBlockScoutApiRoutes, TBaseBlockScoutStatsResponse } from '@common/integrations/base-block-scout';

@Injectable()
export class BaseBlockScoutService implements OnModuleInit {
  private readonly INTEGRATION_KEY = IntegrationNames.BaseBlockScout;

  private readonly logger = new Logger(this.constructor.name);

  private apiUrl: string;
  private integration: IntegrationDocument;

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Integration.name) private readonly integrationModel: IntegrationModel,
  ) {}

  public async onModuleInit() {
    this.logger.debug(`Load integration record by key: "${this.INTEGRATION_KEY}"`, {
      key: this.INTEGRATION_KEY,
    });

    const integration = await this.integrationModel.findOne({ key: this.INTEGRATION_KEY }).exec();
    if (!integration) {
      throw new HttpException(`Integration "${this.INTEGRATION_KEY}" not found`, HttpStatus.NOT_FOUND);
    }

    this.apiUrl = integration.apiUrl;
    this.integration = integration;

    this.logger.verbose(`Integration "${this.INTEGRATION_KEY}" loaded:`, {
      key: integration.key,
      active: integration.active,
      apiUrl: integration.apiUrl,
    });

    if (this.integration.active) {
      await this.initConnection();
    }
  }

  private async initConnection() {
    // const stats = await this.getStats();
    // console.log('stats => ', stats)
  }

  // TOOLS
  private checkActiveStatus() {
    if (!this.integration.active) {
      throw new HttpException(`Integration "${this.INTEGRATION_KEY}" is not active`, HttpStatus.BAD_REQUEST);
    }
  }

  // API
  public async getStats() {
    this.checkActiveStatus();
    const route = BaseBlockScoutApiRoutes.Stats;

    const url = `${this.apiUrl}${route}`;
    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(this.httpService.get<TBaseBlockScoutStatsResponse>(url));
      // this.handleErrorResponse(route, data);

      return data;
    } catch (error) {
      this.logger.error(`Request to "${route}" error: `, error);
      throw error;
    }
  }
}
