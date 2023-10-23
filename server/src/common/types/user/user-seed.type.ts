import { User } from '@schemas/user';

export type TUserSeed = Pick<
  User,
  'name' | 'email' | 'telegramId' | 'hasBotAccess' | 'isAdmin' | 'username'
>;
