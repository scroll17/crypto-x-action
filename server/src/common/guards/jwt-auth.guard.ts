import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DevEndpointHelper } from '@common/helpers';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly devEndpointHelper: DevEndpointHelper) {
    super();
  }

  public canActivate(context: ExecutionContext) {
    const isDev = this.devEndpointHelper.check(context);
    if (isDev) {
      this.logger.log('Is dev endpoint, skip check');
      return true;
    }

    return super.canActivate(context);
  }
}
