import { Global, Module } from '@nestjs/common';
import { ProtectionService } from './protection.service';
import { DataGenerateHelper, IpHelper } from '@common/helpers';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const secret = configService.getOrThrow('protection.securityTokenSecret');
        const expiresIn = configService.getOrThrow('protection.securityTokenExpires');

        return {
          global: false,
          secret: secret,
          signOptions: {
            expiresIn: expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [ProtectionService, DataGenerateHelper, IpHelper],
  exports: [ProtectionService, DataGenerateHelper, IpHelper],
})
export class ProtectionModule {}
