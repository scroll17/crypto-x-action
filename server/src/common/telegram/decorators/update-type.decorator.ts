import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { TTelegrafUpdateType } from '@common/telegram/types/telegraf';

export const TelegrafUpdateType = createParamDecorator(
  (_, ctx: ExecutionContext) =>
    TelegrafExecutionContext.create(ctx).getContext()
      .updateType as TTelegrafUpdateType,
);
