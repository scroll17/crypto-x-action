import _ from 'lodash';
import { Command } from 'nestjs-command';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Integration, IntegrationModel } from '@schemas/integration';
import { TIntegrationSeed } from '@common/types/integrations';

@Injectable()
export class IntegrationSeed {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private configService: ConfigService,
    @InjectModel(Integration.name) private integrationModel: IntegrationModel,
  ) {}

  @Command({ command: 'create:integrations', describe: 'create integrations' })
  async createBulk() {
    const integrations = this.configService.getOrThrow<TIntegrationSeed[]>('integrations');

    this.logger.debug('Generating bulk of Integrations', {
      integrations: integrations.map((i) => i.name),
    });

    for (const integration of integrations) {
      let dbIntegration = await this.integrationModel
        .findOne({
          key: integration.key,
        })
        .exec();
      if (dbIntegration) {
        this.logger.verbose('Integration network already exists. Update existed record', {
          id: dbIntegration._id,
          key: integration.key,
          name: integration.name,
        });

        dbIntegration.name = integration.name;
        dbIntegration.apiUrl = integration.apiUrl;
        dbIntegration.description = integration.description;
        dbIntegration.active = integration.active;

        await dbIntegration.save();
        continue;
      }

      this.logger.debug('Creating Integration with data', {
        key: integration.key,
        name: integration.name,
      });

      dbIntegration = await this.integrationModel.create({
        ...integration,
      });

      this.logger.verbose('Created Integration', {
        id: dbIntegration._id,
        key: integration.key,
        name: integration.name,
      });
    }

    await this.markAsInactive(integrations.map((i) => i.key));
  }

  async markAsInactive(integrationKeys: string[]) {
    const allIntegrationsInDB = await this.integrationModel.find().exec();
    const allIntegrationsInDBMap = new Map(
      allIntegrationsInDB.map((integration) => [integration.key, integration]),
    );

    const removedIntegrationKeys = _.difference([...allIntegrationsInDBMap.keys()], integrationKeys);
    this.logger.debug('Mark as deleted Integrations', {
      deactivatedIntegrations: removedIntegrationKeys,
    });

    await Promise.all(
      removedIntegrationKeys.map(async (removedIntegrationKey) => {
        this.logger.verbose('Mark as inactive Integration', {
          key: removedIntegrationKey,
        });

        await this.integrationModel.updateOne(
          {
            key: removedIntegrationKey,
          },
          {
            $set: {
              active: false,
            },
          },
        );
      }),
    );
  }
}
