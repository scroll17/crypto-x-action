import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, UserNotBlocked } from '@common/guards';
import { ApiBearerAuth } from '@nestjs/swagger';

export function AuthUser() {
  return applyDecorators(UseGuards(JwtAuthGuard, UserNotBlocked), ApiBearerAuth());
}
