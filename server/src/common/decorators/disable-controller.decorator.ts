/*external modules*/
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
/*@common*/
import { ControllerDisabledGuard } from '@common/guards';
import { DecoratorKeys } from '@common/enums';

export function DisableController() {
  return applyDecorators(SetMetadata(DecoratorKeys.IsDisable, true), UseGuards(ControllerDisabledGuard));
}
