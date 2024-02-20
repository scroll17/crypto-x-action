import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScrollBlockScoutService } from './scroll-block-scout.service';
import { ScrollBlockScoutController } from './scroll-block-scout.controller';
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
  providers: [ScrollBlockScoutService],
  controllers: [ScrollBlockScoutController],
  exports: [ScrollBlockScoutService],
})
export class ScrollBlockScoutModule {}
