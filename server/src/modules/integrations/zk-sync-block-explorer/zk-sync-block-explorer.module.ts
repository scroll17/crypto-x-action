import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ZkSyncBlockExplorerService } from './zk-sync-block-explorer.service';
import { ZkSyncBlockExplorerController } from './zk-sync-block-explorer.controller';
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
  providers: [ZkSyncBlockExplorerService],
  controllers: [ZkSyncBlockExplorerController],
  exports: [ZkSyncBlockExplorerService],
})
export class ZkSyncBlockExplorerModule {}
