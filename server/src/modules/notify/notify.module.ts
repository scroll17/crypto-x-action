import { Global, Module } from '@nestjs/common';
import { NotifySocketService } from './socket/socket.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [NotifySocketService],
  exports: [NotifySocketService],
})
export class NotifyModule {}
