import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JobBoardController } from './job-board/job-board.controller';

@Module({
  imports: [],
  controllers: [AdminController, JobBoardController],
  providers: [AdminService],
})
export class AdminModule {}
