import { ApiProperty } from '@nestjs/swagger';
import { AdminModel } from '@entities/admin';
export class LoggedInAdminEntity {
  @ApiProperty({
    type: AdminModel,
    example: AdminModel,
    description: 'The admin record',
  })
  user: AdminModel;

  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsInVzZXJJZCI6NSwiZW1haWwiOiJ6b2xvbG90YXJlbmtvLjIwMTVAZ21haWwuY29tIiwiaWF0IjoxNjg3MDMwNzMxLCJleHAiOjE2ODcwMzEwNTF9.18LICIDeth9LIfQBjt3Dr6ew5S6wBKCppiR3pjMcWC4',
    description: 'The access token string',
  })
  accessToken: string;

  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NJZCI6MzIsImlhdCI6MTY4NzAzMDczMSwiZXhwIjoxOTQ2MjMwNzMxfQ.SZyBJotYtrZRzAXpvFRAcrEYi_wCdkBzIIRx9l5ovQs',
    description: 'The refresh token string',
  })
  refreshToken: string;
}
