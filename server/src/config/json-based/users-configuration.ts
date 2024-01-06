import * as path from 'node:path';
import * as fs from 'node:fs';
import { TUserSeed } from '@common/types';

export const usersConfiguration = (): {
  usersSeed: Array<TUserSeed>;
} => {
  const usersFilePath = path.resolve(__dirname, '../../', '.users.json');
  fs.accessSync(usersFilePath, fs.constants.R_OK | fs.constants.W_OK);

  const users = JSON.parse(
    fs.readFileSync(usersFilePath, {
      encoding: 'utf8',
    }),
  );

  return { usersSeed: users };
};
