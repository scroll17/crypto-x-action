import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MarkdownHelper } from '../../common/helpers';
import { NgrokService } from '../../../ngrok/ngrok.service';
import { ProtectionService } from '../../../protection/protection.service';

@Injectable()
export class CryptoXBotService {
  private readonly logger = new Logger(this.constructor.name);

  private lastSecurityToken: string | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly ngrokService: NgrokService,
    private readonly protectionService: ProtectionService,
  ) {}

  public async getServerUrl() {
    const url = await this.ngrokService.connect({
      port: this.configService.getOrThrow<number>('ports.http'),
      proto: 'http',
    });

    const urlMsg = MarkdownHelper.bold('URL');
    const urlText = MarkdownHelper.monospaced(url);

    return `${urlMsg}: ${urlText}`;
  }

  public async getSecurityToken(telegramUserId: number) {
    if (this.lastSecurityToken) {
      this.logger.debug('Return old security token');

      const tokenMsg = MarkdownHelper.bold('Token');
      const tokenText = MarkdownHelper.monospaced(this.lastSecurityToken);

      return `${tokenMsg}: ${tokenText}`;
    }

    const newSecurityToken = await this.protectionService.generateSecurityToken(telegramUserId);
    this.lastSecurityToken = newSecurityToken;

    const tokenMsg = MarkdownHelper.bold('Token');
    const tokenText = MarkdownHelper.monospaced(newSecurityToken);

    return `${tokenMsg}: ${tokenText}`;
  }

  public async refreshSecurityToken(telegramUserId: number) {
    this.logger.debug('Refresh security token');

    const newSecurityToken = await this.protectionService.generateSecurityToken(telegramUserId);

    const tokenMsg = MarkdownHelper.bold('Token');
    const tokenText = MarkdownHelper.monospaced(newSecurityToken);

    return `${tokenMsg}: ${tokenText}`;
  }
}
