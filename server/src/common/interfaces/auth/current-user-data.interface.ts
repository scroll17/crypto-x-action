import { UserEntity } from '@entities/user';
import { AdminEntity } from '@entities/admin';
export interface ICurrentUserData {
  isAdmin: boolean;
  info: UserEntity | AdminEntity;
}
