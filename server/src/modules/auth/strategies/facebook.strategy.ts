/*external modules*/
import { Strategy } from 'passport-facebook';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/*@interfaces*/
import { IUserDataInThirdPartyService } from '@common/interfaces/auth';
/*@entities*/

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('facebook.facebookAppId'),
      clientSecret: configService.get('facebook.facebookAppSecret'),
      callbackURL: `${configService.get('server.host')}/auth/facebook/callback`,
      scope: ['public_profile', 'email'],
      profileFields: ['id', 'email', 'name', 'verified'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<IUserDataInThirdPartyService> {
    const { id: profileId, emails, name, verified } = profile;
    const email = emails?.[0]?.value;

    if (!email) {
      throw new BadRequestException('Facebook response data issue - "email" not provided.');
    }

    return {
      profileId,
      accessToken,
      refreshToken,
      email,
      name,
      verified: Boolean(verified),
    };
  }
}
