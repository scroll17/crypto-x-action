import { Ctx, Message, On, Wizard, WizardStep, Hears } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/typings/scenes';
import { MarkupCallbackButtonName, TelegrafScene } from '@common/telegram/enums';
import { Markup } from 'telegraf';
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../../redis/redis.service';
import { RedisProtection } from '@common/enums';
import { TelegrafAuthUser, TelegrafCurrentUser } from '@common/telegram/decorators';
import { ITelegramUser } from '@common/types';

@Injectable()
@Wizard(TelegrafScene.SetUserSecret)
export class SetUserSecretWizard {
  constructor(private readonly redisService: RedisService) {}

  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext) {
    await ctx.reply(
      'Отправьте "секрет" в следующем сообщении:',
      Markup.keyboard([MarkupCallbackButtonName.LeaveAction]).resize(),
    );

    ctx.wizard.next();
  }

  @Hears(new RegExp(MarkupCallbackButtonName.LeaveAction))
  @TelegrafAuthUser()
  async onSceneLeave(@Ctx() ctx: WizardContext) {
    await ctx.reply('Вы вышли из установки "секрета"', Markup.removeKeyboard());
    await ctx.scene.leave();
  }

  @On('message')
  @TelegrafAuthUser()
  @WizardStep(2)
  async onMessage(
    @TelegrafCurrentUser() tgUser: ITelegramUser,
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ) {
    if (!msg?.text) {
      await ctx.reply('"Секрет" не обнаружен. Повторите попытку');
      return;
    }

    const secret = msg.text;
    try {
      const redis = this.redisService.getDefaultConnection();
      await redis.set(`${RedisProtection.UserSecret}:${tgUser.telegramId}`, secret);

      await ctx.reply('Новый "секрет" установлен', Markup.removeKeyboard());
      await ctx.scene.leave();
    } catch {
      await ctx.reply('Неизвестная ошибка. Повторите попытку');
      return;
    }
  }
}
