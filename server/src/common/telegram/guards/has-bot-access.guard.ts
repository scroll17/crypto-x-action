import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafException, TelegrafExecutionContext } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegrafMessageHelper } from '@common/telegram/helpers';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from '@schemas/user';

@Injectable()
export class TelegrafHasBotAccessGuard implements CanActivate {
  constructor(
    private messageHelper: TelegrafMessageHelper,
    @InjectModel(User.name) private readonly userModel: UserModel,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const tgCtx =
      TelegrafExecutionContext.create(context).getContext<Context>();

    const { user: tgUser } = this.messageHelper.getTelegramUserFromCtx(tgCtx);

    const user = await this.userModel
      .findOne({
        where: {
          telegramId: tgUser.telegramId,
        },
      })
      .exec();
    if (!user) {
      throw new TelegrafException('User not found');
    }

    return user.hasBotAccess;
  }
}
