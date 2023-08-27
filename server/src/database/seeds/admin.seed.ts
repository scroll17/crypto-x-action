import { Command } from 'nestjs-command';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_REPOSITORY,
  ADMIN_REPOSITORY,
  TAccessTokenRepository,
  TAdminRepository,
} from '../../modules/database/repositories';

@Injectable()
export class AdminSeed {
  private readonly logger = new Logger(this.constructor.name);
  private readonly adminsCount = 3;

  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    @Inject(ADMIN_REPOSITORY)
    private adminRepository: TAdminRepository,
    @Inject(ACCESS_TOKEN_REPOSITORY)
    private accessTokenRepository: TAccessTokenRepository,
  ) {}

  @Command({ command: 'create:admins', describe: 'Create admins' })
  async createBulk() {
    const adminsCount = await this.adminRepository.count();
    if (adminsCount > 1) {
      this.logger.debug('Admins already exist in the DB. Break');
      return;
    }

    this.logger.debug('Generating bulk of Admin records');
    await Promise.all(
      Array(this.adminsCount)
        .fill(0)
        .map(async (_, index) => {
          const aminData = {
            name: `admin${index}`,
            email: `admin${index}@test.com`,
            password: '12345678',
          };
          this.logger.debug('Creating Admin with data', aminData);

          const admin = this.adminRepository.create(aminData);
          await admin.hashPassword();
          await admin.save();

          const { accessToken, refreshToken } = await this.authService.generateAuthTokens('127.0.0.1', admin, true);

          this.logger.verbose('Created Admin', {
            admin,
            accessToken,
            refreshToken,
          });
        }),
    );
  }
}
