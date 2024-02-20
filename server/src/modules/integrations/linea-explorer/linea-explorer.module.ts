import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LineaExplorerService } from './linea-explorer.service';
import { LineaExplorerController } from './linea-explorer.controller';
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
  providers: [LineaExplorerService],
  controllers: [LineaExplorerController],
  exports: [LineaExplorerService],
})
export class LineaExplorerModule {}
