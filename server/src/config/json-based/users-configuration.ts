import * as fs from 'node:fs';
import { TUserSeed } from '@common/types';
import { AppConstants } from '../../app.constants';

export const usersConfiguration = (): {
  usersSeed: Array<TUserSeed>;
} => {
  const usersFilePath = AppConstants.Env.UsersFilePath;
  fs.accessSync(usersFilePath, fs.constants.R_OK | fs.constants.W_OK);

  const users = JSON.parse(
    fs.readFileSync(usersFilePath, {
      encoding: 'utf8',
    }),
  );

  return { usersSeed: users };
};
