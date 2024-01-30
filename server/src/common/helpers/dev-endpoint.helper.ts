import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DecoratorKeys } from '@common/enums';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DevEndpointHelper {
  private readonly isDevEndpointsEnabled: boolean;

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    this.isDevEndpointsEnabled = this.configService.getOrThrow<boolean>('security.devEndpointsEnabled');
  }

  public check(context: ExecutionContext) {
    const isDev =
      this.reflector.get<boolean>(DecoratorKeys.IsDevEndpoint, context.getHandler()) ??
      this.reflector.get<boolean>(DecoratorKeys.IsDevEndpoint, context.getClass());

    return isDev && this.isDevEndpointsEnabled;
  }
}
