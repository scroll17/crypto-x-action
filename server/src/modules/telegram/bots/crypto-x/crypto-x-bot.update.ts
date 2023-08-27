import { Command, Ctx, Help, InjectBot, Next, On, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { Logger } from '@nestjs/common';
import { CryptoXBotService } from './crypto-x-bot.service';

@Update()
export class CryptoXBotUpdate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly cryptoXBotService: CryptoXBotService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<string> {
    return `Бот запущен`;
  }

  @On('message')
  async onMessage(@Ctx() ctx: Context, @Next() next: Function): Promise<void> {
    const message = (ctx.update as any)['message'];

    this.logger.log('Telegram Bot Message:', {
      from: {
        id: message.from.id,
        firstName: message.from.first_name,
        username: message.from.username,
      },
      data: {
        text: message.text,
      },
    });

    return next();
  }

  @Help()
  async onHelp(): Promise<string> {
    const commands = [
      '/get_server_url - Получить URL сервера',
      '/get_security_token - Получить токен аутентификации',
      '/refresh_security_token - Обновить токен аутентификации',
    ].join('\n');
    const description = [
      'Токен аутентификации используеться в таблице',
      'URL сервера также используеться в таблице',
    ].join('\n');

    return `${commands}\n\n${description}`;
  }

  @Command('get_server_url')
  async onGetServerUrlCommand(@Ctx() ctx: Context): Promise<void> {
    const message = await this.cryptoXBotService.getServerUrl();
    await ctx.replyWithMarkdown(message);
  }

  @Command('get_security_token')
  async onGetSecurityTokenCommand(@Ctx() ctx: Context): Promise<void> {
    const message = await this.cryptoXBotService.getSecurityToken(ctx.message!.from.id);
    await ctx.replyWithMarkdown(message);
  }

  @Command('refresh_security_token')
  async onRefreshSecurityTokenCommand(@Ctx() ctx: Context): Promise<void> {
    const message = await this.cryptoXBotService.refreshSecurityToken(ctx.message!.from.id);
    await ctx.replyWithMarkdown(message);
  }
}
