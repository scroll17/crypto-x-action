/*external modules*/
import { md } from 'telegram-escape';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MarkdownHelper {
  public bold(text: string): string {
    return md`*${text}*`;
  }

  public italic(text: string): string {
    return md`_${text}_`;
  }

  public monospaced(text: string): string {
    return `\`${text}\``;
  }

  public escape(text: string | number): string {
    return md`${text}`;
  }

  public json(json: string): string {
    return '```json\n' + json + '\n```';
  }
}
