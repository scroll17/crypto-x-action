import { Global, Module } from '@nestjs/common';
import { ProtectionService } from './protection.service';
import { DataGenerateHelper, DevEndpointHelper, IpHelper } from '@common/helpers';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user';
import { JwtStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const secret = configService.getOrThrow('protection.userTokenSecret');
        const expiresIn = configService.getOrThrow('protection.userTokenExpires');

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
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [ProtectionService, DataGenerateHelper, IpHelper, DevEndpointHelper, JwtStrategy],
  exports: [ProtectionService, DataGenerateHelper, IpHelper, DevEndpointHelper],
})
export class ProtectionModule {}
