import url from 'node:url';
import crypto from 'node:crypto';
import Redis from 'ioredis';
import { Request } from 'express';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { IClientMetadata } from '@common/types';

@Injectable()
export class ProtectionService {
  private readonly logger = new Logger(this.constructor.name);

  private readonly CLIENT_METADATA_HEADER = 'x-client-metadata';
  private readonly redis: Redis;

  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
  ) {
    this.redis = this.redisService.getDefaultConnection();
  }

  private parseSignature(rawSignature: string) {
    const [timestampS, signatureS] = rawSignature.split(',');

    const [t, timestamp] = timestampS.split('=');
    const [scheme, signature] = signatureS.split('=');

    if (!t || !scheme || !timestamp || !signature) {
      this.logger.error('Invalid signature header scheme', {
        t,
        scheme,
        timestamp,
        signature,
      });

      throw new HttpException('Invalid signature header scheme', HttpStatus.BAD_REQUEST);
    }

    return {
      timestamp: Number.parseInt(timestamp, 10),
      signature: signature,
    };
  }

  public getClientMetadata(req: Request) {
    const rawMetadata = req.header(this.CLIENT_METADATA_HEADER);
    if (!rawMetadata) {
      throw new HttpException('Client metadata not found', HttpStatus.BAD_REQUEST);
    }

    return JSON.parse(rawMetadata) as IClientMetadata;
  }

  public async verifyRequest(req: Request) {
    const secret = this.configService.getOrThrow<string>('protection.signatureSecret');
    const header = this.configService.getOrThrow<string>('protection.signatureHeader');
    const timeTolerance = this.configService.getOrThrow<number>('protection.signatureTimeTolerance');

    const rawSignature = req.header(header);
    if (!rawSignature) {
      this.logger.error('Signature header is missed');
      throw new HttpException('Signature is required', HttpStatus.BAD_REQUEST);
    }

    const { timestamp, signature } = this.parseSignature(rawSignature);

    const body = JSON.stringify(req.body);
    const query = JSON.stringify(url.parse(req.url || '', true).query);

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${body}.${query}`, 'utf8')
      .digest('hex');

    if (signature !== computedSignature) {
      this.logger.error('Bad signature');
      throw new HttpException('Bad signature', HttpStatus.FORBIDDEN);
    }

    if (currentTimestamp - timestamp > timeTolerance) {
      this.logger.error('Expired signature');
      throw new HttpException('Expired signature', HttpStatus.FORBIDDEN);
    }
  }
}
