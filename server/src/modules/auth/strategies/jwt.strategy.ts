/*external modules*/
import _ from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/*@interfaces*/
import { ICurrentUserData, IUserDataInAccessToken } from '@common/interfaces/auth';
/*@entities*/
import { UserEntity } from '@entities/user';
import { AdminEntity } from '@entities/admin';
import {
  ACCESS_TOKEN_REPOSITORY,
  TAccessTokenRepository,
  TAdminRepository,
  TUserRepository,
  ADMIN_REPOSITORY,
  USER_REPOSITORY,
} from 'src/modules/database/repositories';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private userRepository: TUserRepository,
    @Inject(ADMIN_REPOSITORY)
    private adminRepository: TAdminRepository,
    @Inject(ACCESS_TOKEN_REPOSITORY)
    private accessTokenRepository: TAccessTokenRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.accessSecret'),
    });
  }

  async validate(payload: IUserDataInAccessToken): Promise<ICurrentUserData> {
    const token = await this.accessTokenRepository.findOne({
      where: {
        id: payload.id,
      },
      loadRelationIds: true,
    });
    if (!token) {
      throw new HttpException('Token is revoked', HttpStatus.FORBIDDEN);
    }

    this.logger.debug('Token found', { token });

    let entity: UserEntity | AdminEntity;
    if (token.userId) {
      const user = await this.userRepository.findOne({
        where: {
          id: token.userId,
        },
      });
      if (!user) throw new NotFoundException('User not found');

      entity = user;
    } else {
      const admin = await this.adminRepository.findOne({
        where: {
          id: token.adminId!,
        },
      });
      if (!admin) throw new NotFoundException('Admin not found');

      entity = admin;
    }

    this.logger.debug('Found user / admin by token:', {
      entity: _.pick(entity, ['id', 'email']),
      isAdmin: Boolean(token.adminId),
    });

    await this.accessTokenRepository.update(
      {
        id: token.id,
      },
      {
        lastUsedAt: new Date(),
      },
    );
    this.logger.debug('Updated last token activity');

    return {
      isAdmin: Boolean(token.adminId),
      info: entity,
    };
  }
}
