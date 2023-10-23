/*external modules*/
import * as _ from 'lodash';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { UserModel } from '@schemas/user';
import { ClientSession, Connection } from 'mongoose';
import { TelegramNotificationBotService } from '../../telegram/notification/notification.service';

export abstract class CommonSyncConsumer {
  protected readonly logger: Logger;
  protected readonly queueName: string;

  // INIT PART: should be init via super() method
  constructor(
    protected readonly notificationBotService: TelegramNotificationBotService,
    protected readonly userModel: UserModel,
    protected readonly connection: Connection,
  ) {}

  // UTILITIES
  protected getReadableQueueName() {
    return this.queueName
      .split('-')
      .map((k) => _.capitalize(k))
      .join(' ');
  }

  protected async unionLogger(job: Job, message: string, data: string | object = {}) {
    this.logger.log(message, data);

    const currentTime = new Date().toTimeString().slice(0, 8);
    await job.log(`[${currentTime}] ${message} ${typeof data === 'object' ? JSON.stringify(data) : data}`);
  }

  protected async notifyAdmin(title: string, obj: Record<string, unknown>) {
    const admin = await this.userModel.findOne({ isAdmin: true }).exec();
    await this.notificationBotService.send({
      to: String(admin!.telegramId),
      title: title,
      jsonObject: obj,
    });
  }

  protected async withTransaction(job: Job, cb: (session: ClientSession) => Promise<Record<string, unknown>>) {
    await this.unionLogger(job, `DB #1: Start session`);
    const session = await this.connection.startSession();

    try {
      let result: Record<string, unknown>;

      await session.withTransaction(async () => {
        await this.unionLogger(job, `DB #2: Run with transaction`);
        result = await cb(session);
      });

      await this.unionLogger(job, `DB #3: Commit transaction`);

      return result!;
    } catch (error) {
      const preparedError = _.omit(error, ['request']);
      if ('response' in preparedError) {
        preparedError['response'] = _.omit(error.response, ['request']);
      }

      await this.unionLogger(job, `DB #3: Rollback transaction`, {
        error: preparedError,
      });
      throw error;
    } finally {
      await this.unionLogger(job, `DB #4: End session`);
      await session.endSession();
    }
  }

  // EVENTS
  protected abstract main(job: Job, session: ClientSession): Promise<Record<string, unknown>>;

  protected process(job: Job) {
    return this.withTransaction(job, async (session) => {
      return this.main(job, session);
    });
  }

  protected onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of Queue ${job.queue.name} with data:`, job.data);
  }

  protected onComplete(job: Job, result: Record<string, unknown>) {
    this.logger.debug(`Job ${job.id} of Queue ${job.queue.name}: completed with result:`, result);
  }

  protected async onFail(job: Job, err: Error) {
    this.logger.debug(`Job ${job.id} of Queue ${job.queue.name} failed with error`, err);

    await this.notifyAdmin(`FAIL: ${this.getReadableQueueName()}`, {
      name: err.name,
      message: err.message,
      stack: err.stack,
      cause: err.cause,
    });
  }
}
