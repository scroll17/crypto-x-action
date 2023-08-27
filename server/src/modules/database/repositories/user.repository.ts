import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '@entities/user';

export const UserRepository = (dataSource: DataSource) =>
  dataSource.getRepository(UserEntity).extend({
    async findByEmailOrPhone(this: Repository<UserEntity>, email: string, phone: string) {
      return this.createQueryBuilder('user')
        .where('user.email = :email', { email })
        .orWhere('user.phone = :phone', { phone })
        .getOne();
    },
  });

export type TUserRepository = ReturnType<typeof UserRepository>;

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export const UserRepositoryProvider = {
  provide: USER_REPOSITORY,
  useFactory: UserRepository,
  inject: [DataSource],
};
