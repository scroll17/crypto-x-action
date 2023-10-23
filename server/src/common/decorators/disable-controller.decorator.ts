/*external modules*/
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
/*@common*/
import { ControllerDisabledGuard } from '@common/guards';

export function DisableController() {
  return applyDecorators(
    SetMetadata('isDisable', true),
    UseGuards(ControllerDisabledGuard),
  );
}
