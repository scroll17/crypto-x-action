import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { MarkdownHelper } from '@common/telegram/helpers';
import { ISendNotification } from '@common/telegram/types';
import { MarkupCallbackButtonName } from '@common/telegram/enums';

@Injectable()
export class TelegramNotificationBotService {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly markdownHelper: MarkdownHelper,
  ) {}

  private buildButtonsWithUrl(buttons: Array<[string, string]>) {
    const markupButtons = buttons.map(([title, url]) =>
      Markup.button.url(this.markdownHelper.escape(title), url),
    );

    return Markup.inlineKeyboard(markupButtons);
  }

  private buildCallbackButtons(buttons: Array<[string, string]>) {
    const markupButtons = buttons.map(([title, data]) =>
      Markup.button.callback(this.markdownHelper.escape(title), data),
    );

    return Markup.inlineKeyboard(markupButtons);
  }

  private buildMessage(data: Omit<ISendNotification, 'button'>) {
    const notificationTitle = this.markdownHelper.bold(data.title);

    let message = `${notificationTitle}`;

    if (!_.isEmpty(data.details)) {
      const detailsMessage = this.markdownHelper.italic('Детали: ');
      const detailsDescription = data
        .details!.map((detail) => {
          const key = this.markdownHelper.bold(detail[0]);
          const value = detail[1];

          return `${key}: ${value}`;
        })
        .join('\n');

      message += `\n\n${detailsMessage}\n${detailsDescription}`;
    }

    if (!_.isEmpty(data.jsonObject)) {
      const objectMessage = this.markdownHelper.italic('Обьект: ');

      const json = JSON.stringify(data.jsonObject, null, 2);
      const jsonMessage = this.markdownHelper.json(json);

      message += `\n\n${objectMessage}\n${jsonMessage}`;
    }

    return message;
  }

  private async updateVisitStatus(ctx: Context) {
    const message: string = _.get(ctx, [
      'update',
      'callback_query',
      'message',
      'text',
    ]);
    if (message) {
      const updatedMessage = message.replace('Выполнено: ❌', 'Выполнено: ✔');
      await ctx.editMessageText(updatedMessage);
    }
  }

  public getTelegramBot() {
    return this.bot.telegram;
  }

  public getConfirmAccessTokenButtons(
    tokenId: number,
  ): Array<[string, string]> {
    return [
      ['Approve', `${MarkupCallbackButtonName.ApproveAccessToken}:${tokenId}`],
      [
        'Disapprove',
        `${MarkupCallbackButtonName.DisapproveAccessToken}:${tokenId}`,
      ],
    ];
  }

  public async send(data: ISendNotification) {
    const extra = {
      parse_mode: 'MarkdownV2' as any,
      ...(_.isEmpty(data.urlButtons)
        ? {}
        : this.buildButtonsWithUrl(data.urlButtons!)),
      ...(_.isEmpty(data.callbackButtons)
        ? {}
        : this.buildCallbackButtons(data.callbackButtons!)),
      ...(data.replyToMessage
        ? { reply_to_message_id: data.replyToMessage }
        : {}),
    };

    if (data.photo) {
      return await this.bot.telegram.sendPhoto(data.to, data.photo, {
        caption: this.buildMessage(data),
        ...extra,
      });
    } else if (data.fileBuffer) {
      return await this.bot.telegram.sendDocument(
        data.to,
        {
          source: data.fileBuffer.content,
          filename: data.fileBuffer.name,
        },
        {
          caption: this.buildMessage(data),
          ...extra,
        },
      );
    } else {
      return await this.bot.telegram.sendMessage(
        data.to,
        this.buildMessage(data),
        extra,
      );
    }
  }
}
