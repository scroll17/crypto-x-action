import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DebankService } from './debank.service';
import { DebankController } from './debank.controller';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
    }),
  ],
  providers: [DebankService],
  controllers: [DebankController],
})
export class DebankModule {}
