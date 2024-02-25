import { Module } from '@nestjs/common';
import { WalletInspectorService } from './wallet-inspector.service';
import { WalletInspectorController } from './wallet-inspector.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Integration, IntegrationSchema } from '@schemas/integration';
import { INTEGRATION_MODULES } from '../integrations';

@Module({
  imports: [
    ...INTEGRATION_MODULES,
    MongooseModule.forFeature([
      {
        name: Integration.name,
        schema: IntegrationSchema,
      },
    ]),
  ],
  providers: [WalletInspectorService],
  controllers: [WalletInspectorController],
})
export class WalletInspectorModule {}
