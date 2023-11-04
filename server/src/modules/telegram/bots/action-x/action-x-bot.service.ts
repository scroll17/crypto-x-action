import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NgrokService } from '../../../ngrok/ngrok.service';
import { ProtectionService } from '../../../protection/protection.service';
import { MarkdownHelper } from '@common/telegram/helpers';
import { TelegrafException } from 'nestjs-telegraf';
import { RedisService } from '../../../redis/redis.service';
import Redis from 'ioredis';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from '@schemas/user';

@Injectable()
export class ActionXBotService {
  private readonly logger = new Logger(this.constructor.name);

  private redis: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly ngrokService: NgrokService,
    private readonly protectionService: ProtectionService,
    private readonly markdownHelper: MarkdownHelper,
    private readonly redisService: RedisService,
    @InjectModel(User.name) private userModel: UserModel,
  ) {
    this.redis = this.redisService.getDefaultConnection();
  }

  private async getUserByTelegramId(id: number) {
    const user = await this.userModel.getByTelegram(id);
    if (!user) {
      throw new TelegrafException('User not found');
    }

    return user;
  }

  public async getServerUrl() {
    const url = await this.ngrokService.connect({
      port: this.configService.getOrThrow<number>('ports.http'),
      proto: 'http',
    });

    const urlMsg = this.markdownHelper.bold('URL');
    const urlText = this.markdownHelper.monospaced(url);

    return `${urlMsg}: ${urlText}`;
  }
}
