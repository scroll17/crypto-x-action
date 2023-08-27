import { ApiProperty } from '@nestjs/swagger';
import { LoggedInUserEntity } from './logged-in-user.entity';

export class LoggedInThirdPartyServiceUserEntity extends LoggedInUserEntity {
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'The property describes did this user created or have already had record',
  })
  new: boolean;
}
