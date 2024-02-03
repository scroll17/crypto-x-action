import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BaseBlockScoutService } from './base-block-scout.service';
import { BaseBlockScoutController } from './base-block-scout.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Integration, IntegrationSchema } from '@schemas/integration';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([
      {
        name: Integration.name,
        schema: IntegrationSchema,
      },
    ]),
  ],
  providers: [BaseBlockScoutService],
  controllers: [BaseBlockScoutController],
})
export class BaseBlockScoutModule {}
