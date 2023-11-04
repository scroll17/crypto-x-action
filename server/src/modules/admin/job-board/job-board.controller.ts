import { Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from '@common/interceptors';
import { JobBoardService } from '../../job/board/job-board.service';
import { AuthUser, DisableController } from '@common/decorators';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('/admin/jobs')
@UseInterceptors(LoggingInterceptor)
@DisableController()
export class JobBoardController {
  constructor(private readonly jobBoardService: JobBoardService) {}

  @Post('/test-audio')
  @AuthUser()
  @HttpCode(201)
  @ApiOperation({ summary: 'Start new job.' })
  @ApiCreatedResponse({
    status: 201,
    description: 'Started job info.',
    type: 'object',
  })
  addAudioJob() {
    return this.jobBoardService.addAudioJob();
  }
}
