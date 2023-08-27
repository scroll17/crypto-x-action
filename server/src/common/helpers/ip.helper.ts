import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class IpHelper {
  private readonly logger = new Logger(this.constructor.name);

  public convertRawIp(rawIp: string) {
    return rawIp.replace(/[^\d.-]/g, '');
  }

  public getHTTPRawIp(request: Request) {
    return (request.headers['x-forwarded-for'] || request.socket.remoteAddress) as string;
  }
}
