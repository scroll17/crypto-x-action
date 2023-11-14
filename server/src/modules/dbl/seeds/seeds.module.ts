import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { BlockchainNetworkSeed, UserSeed } from '../../../database/seeds';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user';
import { Constant, ConstantSchema } from '@schemas/constant';
import { BlockchainNetwork, BlockchainNetworkSchema } from 'src/database/schemas/blockcain/network';

const seeds = [UserSeed, BlockchainNetworkSeed];
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
      {
        name: BlockchainNetwork.name,
        schema: BlockchainNetworkSchema,
      },
    ]),
  ],
  providers: [...seeds],
})
export class SeedsModule {}
