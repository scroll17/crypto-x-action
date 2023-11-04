/*external modules*/
import { Injectable, Logger } from '@nestjs/common';
import { Context, Middleware } from 'telegraf';
/*other*/
import { TelegrafMessageHelper } from '@common/telegram/helpers';

@Injectable()
export class TelegrafMessageLoggingMiddleware {
  private readonly logger = new Logger(this.constructor.name);
  private readonly messageHelper = new TelegrafMessageHelper();

  public middleware() {
    return (context: Context, next: () => Promise<void>) => {
      try {
        const { user, data } = this.messageHelper.getTelegramUserFromCtx(context);

        this.logger.verbose('Telegram Bot Message:', {
          from: {
            id: user.telegramId,
            firstName: user.name,
            username: user.username,
          },
          data: data,
        });

        return next();
      } catch {
        this.logger.warn('Unsupported message type', { type: context.updateType });
        return next();
      }
    };
  }
}

export const telegrafMessageLoggingMiddleware: Middleware<Context> = new TelegrafMessageLoggingMiddleware();
