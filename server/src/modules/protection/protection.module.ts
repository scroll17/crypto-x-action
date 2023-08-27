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
        return {
          global: false,
          secret: configService.get('protection.securityTokenSecret'),
          signOptions: {
            expiresIn: configService.get('protection.securityTokenExpires'),
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
