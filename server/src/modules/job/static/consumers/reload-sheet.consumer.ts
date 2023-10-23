/*external modules*/
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserModel } from '@schemas/user';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CommonSyncConsumer } from '../../consumers/CommonSync';
import { Connection } from 'mongoose';
import { TelegramNotificationBotService } from '../../../telegram/notification/notification.service';

export type TReloadSheetProcessorData = void;
export type TReloadSheetProcessorQueue = Queue<TReloadSheetProcessorData>;

export const reloadSheetName = 'reload-sheet' as const;

@Processor(reloadSheetName)
export class ReloadSheetConsumer extends CommonSyncConsumer {
  protected readonly logger = new Logger(this.constructor.name);
  protected readonly queueName = reloadSheetName;

  constructor(
    private readonly configService: ConfigService,
    protected readonly notificationBotService: TelegramNotificationBotService,
    @InjectModel(User.name)
    protected readonly userModel: UserModel,
    @InjectConnection()
    protected readonly connection: Connection,
  ) {
    super(notificationBotService, userModel, connection);
  }

  // reloadSheet
  protected async main(job: Job<TReloadSheetProcessorData>, session) {
    // // START
    // await this.unionLogger(job, 'Start reload sheet');
    //
    // // 1. Actualize
    // await this.unionLogger(job, '1. Actualize products', {
    //   fullParseProductsFrequency: this.fullParseProductsFrequency
    // });
    //
    // let removedEmptyParseProductResults: number;
    // if (this.fullParseProductsFrequency > 0 && (new Date().getDate() % this.fullParseProductsFrequency === 0)) {
    //   // reparse all only once in N days
    //   removedEmptyParseProductResults =
    //     this.microtronProductsService.removeEmptyProductsParseResults();
    // }
    //
    // const { added, updated, removed } =
    //   await this.syncLocalService.actualizeAllProducts(session);
    //
    // await this.unionLogger(job, '1. Actualize products result:', {
    //   removedEmptyParseProductResultsCount: removedEmptyParseProductResults,
    //   addedProductsCount: added.length,
    //   updatedProductsCount: updated.length,
    //   removedProductsCount: removed.length,
    // });
    //
    // // 2. Sync course
    // await this.unionLogger(job, '2. Sync course');
    //
    // const { updatedCategories, updatedProducts } =
    //   await this.syncLocalService.syncCourse(session);
    //
    // await this.unionLogger(job, '2. Sync course result:', {
    //   updatedCategoriesCount: updatedCategories.length,
    //   updatedProductsCount: updatedProducts.length,
    // });
    //
    // // 3. Reload all categories to Google Sheet
    // await this.unionLogger(job, '3. Reload all categories to Google Sheet');
    //
    // const reloadCategoriesToSheetResult =
    //   await this.syncPromService.reloadAllCategoriesToSheet(session);
    //
    // await this.unionLogger(
    //   job,
    //   '3. Reload all categories to Google Sheet result:',
    //   {
    //     reloadCategoriesToSheetResult: {
    //       ...reloadCategoriesToSheetResult,
    //       updatedCategories:
    //         reloadCategoriesToSheetResult.updatedCategories.length,
    //     },
    //   },
    // );
    //
    // // 4. Reload all products to Google Sheet
    // await this.unionLogger(job, '4. Reload all products to Google Sheet');
    //
    // const reloadProductsToSheetResult =
    //   await this.syncPromService.reloadAllProductsToSheet(session);
    //
    // await this.unionLogger(
    //   job,
    //   '4. Reload all products to Google Sheet result:',
    //   {
    //     reloadProductsToSheetResult: {
    //       ...reloadProductsToSheetResult,
    //       updatedProducts: reloadProductsToSheetResult.updatedProducts.length,
    //     },
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
    // // 6. Result
    // await this.unionLogger(job, '6. Build result & save to Redis');
    //
    // const resultKey = `${this.getReadableQueueName()}-${Date.now()}`;
    // const result = {
    //   actualizeProducts: {
    //     addedProducts: added,
    //     updatedProducts: updated,
    //     removedProducts: removed,
    //   },
    //   syncCourse: {
    //     updatedCategories: updatedCategories.length,
    //     updatedProducts: updatedProducts.length,
    //   },
    //   reloadCategoriesToSheetResult: reloadCategoriesToSheetResult,
    //   reloadProductsToSheetResult: reloadProductsToSheetResult,
    //   importSheet: promImportSheetResult
    // };
    //
    // const redis = this.redisService.getConnection();
    // await redis.setex(resultKey, 60 * 60 * 24 * 2, JSON.stringify(result));
    //
    // // 7. Notify
    // await this.unionLogger(job, '7. Notify Admin');
    //
    // await this.notifyAdmin(this.getReadableQueueName(), {
    //   actualizeProducts: {
    //     removedEmptyParseProductResultsCount: removedEmptyParseProductResults,
    //     addedProductsCount: added.length,
    //     updatedProductsCount: updated.length,
    //     removedProductsCount: removed.length,
    //   },
    //   syncCourse: {
    //     updatedCategories: updatedCategories.length,
    //     updatedProducts: updatedProducts.length,
    //   },
    //   reloadCategoriesToSheetResult: {
    //     ...reloadCategoriesToSheetResult,
    //     updatedCategories:
    //       reloadCategoriesToSheetResult.updatedCategories.length,
    //   },
    //   reloadProductsToSheetResult: {
    //     ...reloadProductsToSheetResult,
    //     updatedProducts: reloadProductsToSheetResult.updatedProducts.length,
    //   },
    //   importSheet: promImportSheetResult,
    //   SAVED_BY_KEY: resultKey
    // });
    //
    // // END
    // await this.unionLogger(job, 'Complete reload sheet');
    //
    // return resultKey;
  }

  @Process()
  protected async process(job: Job<TReloadSheetProcessorData>) {
    return super.process(job);
  }

  @OnQueueActive()
  protected onActive(job) {
    super.onActive(job);
  }

  @OnQueueCompleted()
  protected onComplete(job, result) {
    super.onComplete(job, result);
  }

  @OnQueueFailed()
  protected async onFail(job, err) {
    await super.onFail(job, err);
  }
}
