import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { ITelegramUser } from '@common/types';
import { TelegrafMessageHelper } from '@common/telegram/helpers';

const telegrafMessageHelper = new TelegrafMessageHelper();

export const TelegrafCurrentUser = createParamDecorator<keyof ITelegramUser>(
  (dataKey, ctx: ExecutionContext) => {
    const tgCtx = TelegrafExecutionContext.create(ctx).getContext<Context>();

    const { user } = telegrafMessageHelper.getTelegramUserFromCtx(tgCtx);
    if (dataKey) return user[dataKey];

    return user;
  },
);
