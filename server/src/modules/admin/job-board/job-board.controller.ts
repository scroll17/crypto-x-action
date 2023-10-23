import { Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from '@common/interceptors';
import { JobBoardService } from '../../job/board/job-board.service';
import { Auth } from '@common/decorators';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('/admin/jobs')
@UseInterceptors(LoggingInterceptor)
export class JobBoardController {
  constructor(private readonly jobBoardService: JobBoardService) {}

  @Post('/test-audio')
  @Auth()
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
