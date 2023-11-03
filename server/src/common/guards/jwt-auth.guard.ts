import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DevEndpointHelper, IpHelper } from '@common/helpers';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly ipHelper: IpHelper,
    private readonly devEndpointHelper: DevEndpointHelper,
  ) {
    super();
  }

  public async canActivate(context: ExecutionContext) {
    const isDev = this.devEndpointHelper.check(context);
    if (isDev) {
      this.logger.log('Is dev endpoint, skip check');
      return true;
    }

    try {
      return (await super.canActivate(context)) as unknown as Promise<boolean>;
    } catch (error) {
      const request: Request = context.switchToHttp().getRequest();

      this.logger.error('Bad request to guard endpoint', {
        rawIp: this.ipHelper.getHTTPRawIp(request),
        ip: this.ipHelper.convertRawIp(this.ipHelper.getHTTPRawIp(request)),
        headers: request.headers,
        route: request.route,
        body: request.body,
        msg: error.message,
        timestamp: new Date(),
      });

      throw error;
    }
  }
}
