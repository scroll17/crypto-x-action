import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegrafMessageHelper } from '@common/telegram/helpers';

@Injectable()
export class TelegrafMessageLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private messageHelper: TelegrafMessageHelper) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // TODO: skip other because moved to Middleware
    return next.handle();

    const telegramContext = TelegrafExecutionContext.create(context).getContext<Context>();

    try {
      const { user, data } = this.messageHelper.getTelegramUserFromCtx(telegramContext);

      this.logger.verbose('Telegram Bot Message:', {
        from: {
          id: user.telegramId,
          firstName: user.name,
          username: user.username,
        },
        data: data,
      });

      return next.handle();
    } catch {
      this.logger.warn('Unsupported message type', { type: telegramContext.updateType });
      return next.handle();
    }
  }
}
