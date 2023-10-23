/*external modules*/
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Logger } from '@nestjs/common';
import { User, UserModel } from '@schemas/user';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CommonSyncConsumer } from './CommonSync';
import { ClientSession, Connection } from 'mongoose';
import { TelegramNotificationBotService } from '../../telegram/notification/notification.service';

export type TInitLoadSheetProcessorData = void;
export type TInitLoadSheetProcessorQueue = Queue<TInitLoadSheetProcessorData>;

export const initLoadSheetName = 'init-load-sheet' as const;

@Processor(initLoadSheetName)
export class InitLoadSheetConsumer extends CommonSyncConsumer {
  protected readonly logger = new Logger(this.constructor.name);
  protected readonly queueName = initLoadSheetName;

  constructor(
    protected readonly notificationBotService: TelegramNotificationBotService,
    @InjectModel(User.name)
    protected readonly userModel: UserModel,
    @InjectConnection()
    protected readonly connection: Connection,
  ) {
    super(notificationBotService, userModel, connection);
  }

  // initLoadSheet
  protected async main(_job: Job<TInitLoadSheetProcessorData>, _session: ClientSession) {
    return {};
    // // START
    // await this.unionLogger(job, 'Start init load sheet');
    //
    // // 1. Load all categories to DB
    // await this.unionLogger(job, '1. Load all categories to DB');
    //
    // const loadedCategories = await this.syncLocalService.loadAllCategoriesToDB(
    //   session,
    // );
    //
    // await this.unionLogger(job, '1. Load all categories to DB result:', {
    //   loadedCategoriesCount: loadedCategories.length,
    // });
    //
    // // 2. Load all products to DB
    // await this.unionLogger(job, '2. Load all products to DB');
    //
    // const loadedProducts = await this.syncLocalService.loadAllProductsToDB(
    //   session,
    // );
    //
    // await this.unionLogger(job, '2. Load all products to DB result:', {
    //   loadedProductsCount: loadedProducts.length,
    // });
    //
    // // 3. Load all categories to Google Sheet
    // await this.unionLogger(job, '3. Load all categories to Google Sheet');
    //
    // const loadCategoriesToSheetResult =
    //   await this.syncPromService.loadAllCategoriesToSheet(session);
    //
    // await this.unionLogger(
    //   job,
    //   '3. Load all categories to Google Sheet result:',
    //   {
    //     ...loadCategoriesToSheetResult,
    //     updatedCategories: loadCategoriesToSheetResult.updatedCategories.length,
    //   },
    // );
    //
    // // 4. Load all products to Google Sheet
    // await this.unionLogger(job, '4. Load all products to Google Sheet');
    //
    // const loadProductsToSheetResult =
    //   await this.syncPromService.loadAllProductsToSheet(session);
    //
    // await this.unionLogger(
    //   job,
    //   '4. Load all products to Google Sheet result:',
    //   {
    //     ...loadProductsToSheetResult,
    //     updatedProducts: loadProductsToSheetResult.updatedProducts.length,
    //   },
    // );
    //
    // // 5. Prom import Google Sheet
    // await this.unionLogger(job, '5. Prom import Google Sheet');
    //
    // const promImportSheetResult = await this.promProductsService.importSheet();
    //
    // await this.unionLogger(
    //   job,
    //   '5. Prom import Google Sheet result:',
    //   promImportSheetResult,
    // );
    //
    // // 6. Notify
    // await this.unionLogger(job, '6. Notify Admin');
    //
    // await this.notifyAdmin(this.getReadableQueueName(), {
    //   loadAllCategoriesToDB: {
    //     loadedCategories: loadedCategories.length,
    //   },
    //   loadAllProductsToDB: {
    //     loadedProducts: loadedProducts.length,
    //   },
    //   loadAllCategoriesToSheet: {
    //     ...loadCategoriesToSheetResult,
    //     updatedCategories: loadCategoriesToSheetResult.updatedCategories.length,
    //   },
    //   loadProductsToSheetResult: {
    //     ...loadProductsToSheetResult,
    //     updatedProducts: loadProductsToSheetResult.updatedProducts.length,
    //   },
    //   importSheet: promImportSheetResult,
    // });
    //
    // // 7. Build result
    // await this.unionLogger(job, '7. Build result');
    //
    // const result = {
    //   loadAllCategoriesToDB: {
    //     loadedCategories: loadedCategories.length,
    //   },
    //   loadAllProductsToDB: {
    //     loadedProducts: loadedProducts.length,
    //   },
    //   loadAllCategoriesToSheet: loadCategoriesToSheetResult,
    //   loadProductsToSheetResult: loadProductsToSheetResult,
    //   importSheet: promImportSheetResult,
    // };
    //
    // // END
    // await this.unionLogger(job, 'Complete init load sheet');
    //
    // return result;
  }

  @Process()
  protected async process(job: Job<TInitLoadSheetProcessorData>) {
    return super.process(job);
  }

  @OnQueueActive()
  protected onActive(job: Job) {
    super.onActive(job);
  }

  @OnQueueCompleted()
  protected onComplete(job: Job, result: Record<string, unknown>) {
    super.onComplete(job, result);
  }

  @OnQueueFailed()
  protected async onFail(job: Job, err: Error) {
    await super.onFail(job, err);
  }
}
