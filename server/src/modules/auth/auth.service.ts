/*external modules*/
import { Injectable, Logger } from '@nestjs/common';
import { UserDocument } from '@schemas/user';
import { JwtService } from '@nestjs/jwt';
/*services*/
/*@common*/
/*@entities*/
/*@interfaces*/

@Injectable()
export class AuthService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private jwtService: JwtService) {}

  public generateAuthToken(user: Pick<UserDocument, '_id'>) {
    // property name of sub need for hold our userId value to be consistent with JWT standards.
    const payload = {
      sub: user._id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
