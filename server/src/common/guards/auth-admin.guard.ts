import { applyDecorators, UseGuards } from '@nestjs/common';
import { AdminGuard, JwtAuthGuard } from '@common/guards';

export function AuthAdmin() {
  return applyDecorators(UseGuards(JwtAuthGuard, AdminGuard));
}
