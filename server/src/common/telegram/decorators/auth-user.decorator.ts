import { applyDecorators, UseGuards } from '@nestjs/common';
import { TelegrafHasBotAccessGuard } from '../guards';

export function TelegrafAuthUser() {
  return applyDecorators(UseGuards(TelegrafHasBotAccessGuard));
}
