import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DecoratorKeys } from '@common/enums';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DevEndpointHelper {
  private readonly isDevEnv: boolean;

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    this.isDevEnv = this.configService.getOrThrow<boolean>('isDev');
  }

  public check(context: ExecutionContext) {
    const isDev =
      this.reflector.get<boolean>(DecoratorKeys.IsDevEndpoint, context.getHandler()) ??
      this.reflector.get<boolean>(DecoratorKeys.IsDevEndpoint, context.getClass());

    return isDev && this.isDevEnv;
  }
}
