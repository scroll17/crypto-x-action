import _ from 'lodash';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, JobStatus } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { reloadSheetName, TReloadSheetProcessorQueue } from './consumers';

@Injectable()
export class JobStaticService implements OnModuleInit {
  private readonly logger = new Logger(this.constructor.name);

  private readonly staticQueues: Queue[] = [];
  private readonly formerStaticQueues: Queue[] = [];

  constructor(
    private configService: ConfigService,
    @InjectQueue(reloadSheetName)
    private reloadSheetQueue: TReloadSheetProcessorQueue,
  ) {
    this.staticQueues.push(reloadSheetQueue);
  }

  // POINT OF ENTRY
  async onModuleInit() {
    this.logger.log('1. Remove former static jobs..');

    await this.clearFormerRepeatableJobs();

    this.logger.log('1. Former static jobs removed');

    this.logger.log('2. Starting static jobs..');

    await this.reCreateRepeatableJobs();

    this.logger.log('2. Static jobs started');
  }

  // USEFUL FUNCTIONS
  public async removeAllNextJobs(staticQueue: Queue, readableQueueName: string) {
    const allNextJobs = await staticQueue.getJobs(['active', 'waiting', 'delayed', 'paused', 'failed']);
    const result: Record<JobStatus | 'stuck', number> = {
      active: 0,
      waiting: 0,
      delayed: 0,
      paused: 0,
      failed: 0,
      completed: 0,
      stuck: 0,
    };

    await Promise.all(
      _.map(allNextJobs, async (job) => {
        const status = await job.getState();
        result[status] = result[status] + 1;

        await job.remove();
      }),
    );

    this.logger.debug(`"${readableQueueName}" next jobs removed:`, result);

    return result;
  }

  public async removeRepeatableJobs(staticQueue: Queue, readableQueueName: string) {
    const repeatableJobs = await staticQueue.getRepeatableJobs();

    if (repeatableJobs.length > 0) {
      await Promise.all(_.map(repeatableJobs, (job) => staticQueue.removeRepeatableByKey(job.key)));

      this.logger.debug(`"${readableQueueName}" repeatable jobs removed:`, {
        oldJobs: _.map(repeatableJobs, 'key'),
      });
    }
  }

  public async clearStaticQueueJobs(staticQueue: Queue, readableQueueName: string) {
    try {
      await this.removeRepeatableJobs(staticQueue, readableQueueName);

      await this.removeAllNextJobs(staticQueue, readableQueueName);
    } catch (error) {
      this.logger.error('Received error until removing repeatable jobs:', {
        err: error,
        queueName: readableQueueName,
      });
    }
  }

  public async initStaticQueue(staticQueue: Queue, readableQueueName: string) {
    try {
      await staticQueue.add({});
      this.logger.debug(`"${readableQueueName}" started`);
    } catch (error) {
      this.logger.error('Received error until init (add) repeatable job to queue:', {
        err: error,
        queueName: readableQueueName,
      });
    }
  }

  // MAIN PART
  public async reCreateRepeatableJobs() {
    await Promise.all(
      _.map(this.staticQueues, async (staticQueue) => {
        const readableQueueName = staticQueue.name
          .split('-')
          .map((k) => _.capitalize(k))
          .join(' ');

        await this.clearStaticQueueJobs(staticQueue, readableQueueName);

        await this.initStaticQueue(staticQueue, readableQueueName);
      }),
    );
  }

  public async clearFormerRepeatableJobs() {
    await Promise.all(
      _.map(this.formerStaticQueues, async (staticQueue) => {
        const readableQueueName = staticQueue.name
          .split('-')
          .map((k) => _.capitalize(k))
          .join(' ');

        await this.clearStaticQueueJobs(staticQueue, readableQueueName);
      }),
    );
  }
}
