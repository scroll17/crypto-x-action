/*external modules*/
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
/*@common*/
import { EndpointDisabledGuard } from '@common/guards';
import { DecoratorKeys } from '@common/enums';

export function DisableEndpoint() {
  return applyDecorators(SetMetadata(DecoratorKeys.IsDisable, true), UseGuards(EndpointDisabledGuard));
}
