import { applyDecorators, UseGuards } from '@nestjs/common';
import { IsDevEndpoint } from '@common/decorators/is-dev-endpoint.decorator';
import { JwtAuthGuard } from '@common/guards';

export const DevEndpoint = () => applyDecorators(IsDevEndpoint(), UseGuards(JwtAuthGuard));
