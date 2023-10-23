import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@common/guards';

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
