/*external modules*/
import _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { ITelegramUser } from '@common/types';
import { Context } from 'telegraf';
import { TelegrafException } from 'nestjs-telegraf';

@Injectable()
export class TelegrafMessageHelper {
  public getTelegramUserFromCtx<T>(context: Context): {
    user: ITelegramUser;
    data: T;
  } {
    switch (context.updateType) {
      case 'message': {
        const message = context.message!;

        const user = {
          telegramId: message.from.id,
          name: message.from.first_name,
          username: message.from.username,
          chatId: message.chat.id,
        };

        return {
          user,
          data: _.get(message, ['text']),
        };
      }
      case 'callback_query': {
        const message = context.callbackQuery!;

        const user = {
          telegramId: message.from.id,
          name: message.from.first_name,
          username: message.from.username,
          chatId: message.from.id,
        };

        return {
          user,
          data: _.get(message, ['data']),
        };
      }
      default: {
        throw new TelegrafException(`Unsupported updateType = "${context.updateType}"`);
      }
    }
  }
}
