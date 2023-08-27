/*external modules*/
import { Strategy } from 'passport-google-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/*@interfaces*/
import { IUserDataInThirdPartyService } from '@common/interfaces/auth';
/*@entities*/

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('google.googleAppId'),
      clientSecret: configService.get('google.googleAppSecret'),
      callbackURL: `${configService.get('server.host')}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<IUserDataInThirdPartyService> {
    const { id: profileId, email, name, verified } = profile;

    if (!email) {
      throw new BadRequestException('Google response data issue - "email" not provided.');
    }

    return {
      profileId,
      accessToken,
      refreshToken,
      email,
      name,
      verified,
    };
  }
}
