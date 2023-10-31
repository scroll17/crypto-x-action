import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserEntity, UserModel } from '@schemas/user';
import { FindUserDto } from './dto';
import { PaginateResultEntity } from '@common/entities';

@Injectable()
export class UserService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: UserModel,
  ) {}

  public async getAll(dto: FindUserDto): Promise<PaginateResultEntity<UserEntity>> {
    this.logger.debug('Get all users', { ...dto });

    const users = await this.userModel.paginate(dto);

    this.logger.debug('Users selection result:', {
      meta: users.meta,
    });

    return users;
  }
}
