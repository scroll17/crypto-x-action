import { Module } from '@nestjs/common';
import { BlockchainAccountService } from './blockchain-account.service';
import { BlockchainAccountController } from './blockchain-account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [BlockchainAccountService],
  controllers: [BlockchainAccountController],
})
export class BlockchainAccountModule {}
