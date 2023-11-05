/*external modules*/
import Redis from 'ioredis';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/*@interfaces*/
import { IProtectionTokenPayload } from '@common/types';
/*@entities*/
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModel } from '@schemas/user';
import { RedisService } from '../../redis/redis.service';
import { RedisProtection } from '@common/enums';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(this.constructor.name);

  private redis: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    @InjectModel(User.name) private readonly userModel: UserModel,
  ) {
    const header = configService.getOrThrow<string>('protection.userTokenHeader');
    const secret = configService.getOrThrow<string>('protection.userTokenSecret');

    super({
      jwtFromRequest: ExtractJwt.fromHeader(header),
      ignoreExpiration: false,
      secretOrKey: secret,
    });

    this.redis = this.redisService.getDefaultConnection();
  }

  public async validate(payload: IProtectionTokenPayload): Promise<UserDocument> {
    if (!payload.telegramId) {
      throw new HttpException('Invalid JWT payload', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.getByTelegram(payload.telegramId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    this.logger.debug('Request from User', {
      externalUserId: payload.userId,
      telegramId: payload.telegramId,
      email: payload.email,
    });

    const secret = await this.redis.get(`${RedisProtection.UserSecret}:${payload.telegramId}`);
    if (!secret) {
      throw new HttpException('Secret not found', HttpStatus.FORBIDDEN);
    }

    if (secret !== payload.secret) {
      throw new HttpException('Secret is invalid', HttpStatus.FORBIDDEN);
    }

    return user;
  }
}
