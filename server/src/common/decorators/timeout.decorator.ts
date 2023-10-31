import { SetMetadata } from '@nestjs/common';
import { DecoratorKeys } from '@common/enums';

export const Timeout = (time: number) => SetMetadata(DecoratorKeys.Timeout, time);
