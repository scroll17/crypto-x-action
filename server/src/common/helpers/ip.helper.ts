import { IPVersion, isIP } from 'node:net';
import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Request } from 'express';

@Injectable()
export class IpHelper {
  private readonly logger = new Logger(this.constructor.name);

  public convertRawIp(rawIp: string) {
    return rawIp.replaceAll(/[^\d.-]/g, '');
  }

  public getIPVersion(rawIp: string): IPVersion {
    const version = isIP(rawIp);
    return version === 4 ? `ipv4` : `ipv6`;
  }

  public convertToNum(ip: string) {
    return Number(
      ip
        .split('.')
        .map((d) => ('000' + d).slice(-3))
        .join(''),
    );
  }

  public getHTTPRawIp(request: Request) {
    return (request.headers['X-Real-IP'] ||
      request.headers['X-Forwarded-For'] ||
      request.headers['x-forwarded-for'] ||
      request.socket.remoteAddress) as string;
  }

  public getSocketRawIp(client: Pick<Socket, 'handshake' | 'request'>) {
    return (client.handshake.headers['X-Real-IP'] ||
      client.handshake.headers['X-Forwarded-For'] ||
      client.handshake.headers['x-forwarded-for'] ||
      client.request.socket.remoteAddress) as string;
  }
}
