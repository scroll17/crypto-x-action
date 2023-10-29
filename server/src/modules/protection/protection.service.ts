import ms from 'ms';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { DataGenerateHelper } from '@common/helpers';
import { RedisProtection } from '@common/enums';
import { JwtService } from '@nestjs/jwt';
import { IDataInSecurityToken } from '@common/types/protection';
import Redis from 'ioredis';

@Injectable()
export class ProtectionService {
  private readonly logger = new Logger(this.constructor.name);

  private readonly redis: Redis;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private dataGenerateHelper: DataGenerateHelper,
  ) {
    this.redis = this.redisService.getDefaultConnection();
  }

  public async generateSecurityToken(userId: string, telegramId: number) {
    const securityTokenLiveTime = Math.floor(
      ms(
        this.configService.getOrThrow<string>(
          'protection.securityTokenExpires',
        ),
      ) / 1000,
    );
    const tokenStr = this.dataGenerateHelper.randomHEX(16);

    this.logger.debug('Generate new security token', {
      liveTime: securityTokenLiveTime,
      userId: userId,
    });

    await this.redis.setex(RedisProtection.SecurityToken, securityTokenLiveTime, tokenStr);

    const securityTokenPayload: IDataInSecurityToken = {
      sub: userId,
      token: tokenStr,
      telegramId: telegramId,
    };
    return await this.jwtService.signAsync(securityTokenPayload);
  }

  public async validateSecurityToken(token: string) {
    this.logger.debug('Validate security token', {
      token,
    });

    try {
      const securityToken = await this.jwtService.verifyAsync<IDataInSecurityToken>(token);
      if (!securityToken) {
        return {
          valid: false,
          error: new HttpException('Token is invalid', HttpStatus.BAD_REQUEST),
        };
      }

      this.logger.debug('Security token data', {
        data: securityToken,
      });

      const localToken = await this.getLocalSecurityToken();
      if (!localToken) {
        return {
          valid: false,
          error: new HttpException(
            'Local Token does not exist yet or has already expired',
            HttpStatus.BAD_REQUEST,
          ),
        };
      }

      if (securityToken.token !== localToken) {
        return {
          valid: false,
          error: new HttpException('Passed Token is wrong', HttpStatus.FORBIDDEN),
        };
      }

      return {
        valid: true,
        error: null,
      };
    } catch {
      return {
        valid: false,
        error: new HttpException('Token malformed or expired', HttpStatus.BAD_REQUEST),
      };
    }
  }

  public async getLocalSecurityToken() {
    return this.redis.get(RedisProtection.SecurityToken);
  }
}
