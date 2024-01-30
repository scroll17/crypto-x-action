import { SetMetadata } from '@nestjs/common';
import { DecoratorKeys } from '@common/enums';

export const IsDevEndpoint = () => SetMetadata(DecoratorKeys.IsDevEndpoint, true);
