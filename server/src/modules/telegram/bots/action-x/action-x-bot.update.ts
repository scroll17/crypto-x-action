import { Command, Ctx, Help, InjectBot, Next, On, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { Logger, UseFilters, UseInterceptors } from '@nestjs/common';
import { ActionXBotService } from './action-x-bot.service';
import { TelegrafExceptionFilter } from '@common/telegram/filters';
import { TelegrafAuthUser, TelegrafCurrentUser } from '@common/telegram/decorators';
import { ITelegramUser } from '@common/types';

@Update()
@UseInterceptors()
@UseFilters(TelegrafExceptionFilter)
export class ActionXBotUpdate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly actionXBotService: ActionXBotService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<string> {
    return `Бот запущен`;
  }

  @On('message')
  async onMessage(@Ctx() ctx: Context, @Next() next: () => Promise<void>): Promise<void> {
    // TODO: update last activity
    return next();
  }

  @Help()
  @TelegrafAuthUser()
  async onHelp(): Promise<string> {
    const commands = [
      '/get_server_url - Получить URL сервера',
      '/set_user_secret - Установить секрет для аутентификации',
    ].join('\n');
    const description = [
      'Токен аутентификации используеться для установления пользователя делающего запрос',
      'URL сервера используеться в Getaway server',
    ].join('\n');

    return `${commands}\n\n${description}`;
  }

  @Command('get_server_url')
  @TelegrafAuthUser()
  async onGetServerUrlCommand(@Ctx() ctx: Context): Promise<void> {
    const message = await this.actionXBotService.getServerUrl();
    await ctx.replyWithMarkdownV2(message);
  }

  @Command('set_user_secret')
  @TelegrafAuthUser()
  async onSetUserSecretCommand(
    @TelegrafCurrentUser() tgUser: ITelegramUser,
    @Ctx() ctx: Context,
  ): Promise<void> {
    // const message = await this.actionXBotService.getSecurityToken(ctx.message!.from.id);
    // await ctx.replyWithMarkdown(message);
  }
}
