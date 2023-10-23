/*external modules*/
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpStatus } from '@nestjs/common/enums';
import { IpHelper } from '../helpers';
import { ProtectionService } from '../../modules/protection/protection.service';

@Injectable()
export class SecurityTokenGuard implements CanActivate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly protectionService: ProtectionService,
    private readonly ipHelper: IpHelper,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    switch (context.getType()) {
      case 'http': {
        const request: Request = context.switchToHttp().getRequest();

        const token = request.header('X-Protection-Token');
        const ip = this.ipHelper.getHTTPRawIp(request);

        await this.checkAccess(context, token, this.ipHelper.convertRawIp(ip));
        break;
      }
    }

    return true;
  }

  private async checkAccess(
    context: ExecutionContext,
    token: string | undefined,
    ip: string,
  ) {
    if (!token) {
      this.logBadRequest(context, 'No X-Protection-Token header');
      throw this.getException(
        context,
        'Token is required',
        HttpStatus.FORBIDDEN,
      );
    }

    const { valid, error } =
      await this.protectionService.validateSecurityToken(token);
    this.logger.debug('Security token validation result:', {
      valid,
      error,
    });

    if (!valid && error) {
      this.logBadRequest(context, error.message);
      throw error;
    }
  }

  private getException(
    context: ExecutionContext,
    text: string,
    status: number,
  ) {
    const contextType = context.getType();

    if (contextType === 'http') {
      return new HttpException(text, status);
    }
  }

  private logBadRequest(context: ExecutionContext, msg: string) {
    const contextType = context.getType();

    switch (contextType) {
      case 'http': {
        const request: Request = context.switchToHttp().getRequest();

        this.logger.debug('Bad request to guard endpoint', {
          rawIp: this.ipHelper.getHTTPRawIp(request),
          ip: this.ipHelper.convertRawIp(this.ipHelper.getHTTPRawIp(request)),
          headers: request.headers,
          route: request.route,
          body: request.body,
          msg: msg,
          timestamp: new Date(),
        });
        break;
      }
    }
  }
}
