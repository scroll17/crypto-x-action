/*external modules*/
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/*@interfaces*/
import { IProtectionTokenPayload } from '@common/types';
/*@entities*/
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModel } from '@schemas/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: UserModel,
  ) {
    const header = configService.getOrThrow<string>('protection.userTokenHeader');
    const secret = configService.getOrThrow<string>('protection.userTokenSecret');

    super({
      jwtFromRequest: ExtractJwt.fromHeader(header),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  public async validate(payload: IProtectionTokenPayload): Promise<UserDocument> {
    if (!payload.telegramId) {
      throw new HttpException('Invalid JWT payload', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.getByTelegram(payload.telegramId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    this.logger.debug('Request from User', {
      externalUserId: payload.userId,
      telegramId: payload.telegramId,
      email: payload.email,
    });

    // TODO: check for secret in Redis


    return user;
  }
}
