import { DataSource } from 'typeorm';
import { AdminEntity } from '@entities/admin';

export const AdminRepository = (dataSource: DataSource) => dataSource.getRepository(AdminEntity).extend({});

export type TAdminRepository = ReturnType<typeof AdminRepository>;

export const ADMIN_REPOSITORY = Symbol('ADMIN_REPOSITORY');

export const AdminRepositoryProvider = {
  provide: ADMIN_REPOSITORY,
  useFactory: AdminRepository,
  inject: [DataSource],
};
