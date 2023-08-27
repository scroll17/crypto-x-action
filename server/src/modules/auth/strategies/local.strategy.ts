/*external modules*/
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
/*services*/
import { AuthService } from '../auth.service';
/*@interfaces*/
import { ICurrentUserData } from '@common/interfaces/auth';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<ICurrentUserData> {
    const data = await this.authService.validateUser(email, password);
    return data;
  }
}
