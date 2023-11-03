import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, UserNotBlocked } from '@common/guards';

export function AuthUser() {
  return applyDecorators(UseGuards(JwtAuthGuard, UserNotBlocked));
}
