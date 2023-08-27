/*external modules*/
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
/*@entities*/
import { ALL_DB_ENTITIES } from '@entities/index';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          url: configService.getOrThrow('postgres.url'),
          entities: ALL_DB_ENTITIES,
          logging: true,
          synchronize: configService.getOrThrow('database.syncEntities'),
          autoLoadEntities: configService.getOrThrow('database.autoLoadEntities'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
