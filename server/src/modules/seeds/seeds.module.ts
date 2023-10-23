import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { UserSeed } from '../../database/seeds';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user';
import { Constant, ConstantSchema } from '@schemas/constant';

const seeds = [UserSeed];
// const commands: unknown[] = [];

@Module({
  imports: [
    CommandModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Constant.name,
        schema: ConstantSchema,
      },
    ]),
  ],
  providers: [...seeds],
})
export class SeedsModule {}
