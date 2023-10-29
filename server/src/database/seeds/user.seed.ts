import _ from 'lodash';
import { Command } from 'nestjs-command';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from '@schemas/user';
import { ConfigService } from '@nestjs/config';
import { TUserSeed } from '@common/types';

@Injectable()
export class UserSeed {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: UserModel,
  ) {}

  @Command({ command: 'create:users', describe: 'create users' })
  async createBulk() {
    const usersSeed =
      this.configService.getOrThrow<Array<TUserSeed>>('usersSeed');

    this.logger.debug('Generating bulk of Users records');
    await Promise.all(
      usersSeed.map(async (userSeed) => {
        let user = await this.userModel
          .findOne({
            email: userSeed.email,
          })
          .exec();
        if (user) {
          this.logger.verbose('User already exists', {
            name: userSeed.name,
            email: userSeed.email,
            hasBotAccess: userSeed.hasBotAccess,
            telegramId: userSeed.telegramId,
          });
          return;
        }

        this.logger.debug('Creating User with data', {
          name: userSeed.name,
          email: userSeed.email,
          hasBotAccess: userSeed.hasBotAccess,
          telegramId: userSeed.telegramId,
        });
        user = await this.userModel.create({
          ...userSeed,
        });

        this.logger.verbose('Created Users', {
          user: _.pick(user, ['name', 'email']),
        });
      }),
    );
  }
}
