import { SetMetadata } from '@nestjs/common';
import { DecoratorKeys } from '@common/enums';

export const DevEndpoint = () => SetMetadata(DecoratorKeys.IsDevEndpoint, true);
