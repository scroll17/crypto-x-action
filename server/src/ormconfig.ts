import { init, configuration } from './config/configuration';
import { ConnectionOptions } from 'typeorm';

init();
const config = configuration();

export default {
  type: 'postgres',
  url: config.postgres.url,
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
  entities: [__dirname + '/database/entities/**/*.entity.ts'],
  cli: {
    migrationsDir: 'src/database/migrations',
    entitiesDir: 'src/database/entities',
  },
  synchronize: config.database.syncEntities,
  logging: true,
  logger: 'advanced-console',
} as ConnectionOptions;
