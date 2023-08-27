import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { AdminSeed } from '../../database/seeds/admin.seed';
import { AuthModule } from '../auth/auth.module';
import { AccessTokenRepositoryProvider, AdminRepositoryProvider } from '../database/repositories';

@Module({
  imports: [CommandModule, AuthModule],
  providers: [AdminSeed, AccessTokenRepositoryProvider, AdminRepositoryProvider],
})
export class SeedModule {}
