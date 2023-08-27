import { DataSource, Repository } from 'typeorm';
import { AccessTokenEntity } from '@entities/accessToken';

export const AccessTokenRepository = (dataSource: DataSource) =>
  dataSource.getRepository(AccessTokenEntity).extend({
    async findByEntity(this: Repository<AccessTokenEntity>, entityId: number) {
      return this.createQueryBuilder('accessToken')
        .where('accessToken.userId = :userId', { userId: entityId })
        .orWhere('accessToken.adminId = :adminId', { adminId: entityId })
        .getMany();
    },
    async findByIdAndEntity(this: Repository<AccessTokenEntity>, id: number, entityId: number, isAdmin: boolean) {
      const query = this.createQueryBuilder('accessToken').where('accessToken.id = :id', { id });

      isAdmin
        ? query.andWhere('accessToken.adminId = :adminId', {
            adminId: entityId,
          })
        : query.andWhere('accessToken.userId = :userId', { userId: entityId });

      return await query.getOne();
    },
  });

export type TAccessTokenRepository = ReturnType<typeof AccessTokenRepository>;

export const ACCESS_TOKEN_REPOSITORY = Symbol('ACCESS_TOKEN_REPOSITORY');

export const AccessTokenRepositoryProvider = {
  provide: ACCESS_TOKEN_REPOSITORY,
  useFactory: AccessTokenRepository,
  inject: [DataSource],
};
