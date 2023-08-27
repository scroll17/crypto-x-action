/*external modules*/
import bcrypt from 'bcrypt';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Exclude, instanceToPlain } from 'class-transformer';
/*@entities*/
import { UserWentFrom } from './user-went-from.enum';
import { AccessTokenEntity } from '../accessToken';
import { UserModel } from '@entities/user/user.model';

@Entity({ name: 'users', schema: 'public' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'first_name', length: 255, nullable: false })
  firstName: string;

  @Column('varchar', { name: 'last_name', length: 255, nullable: false })
  lastName: string;

  @Column('citext', { nullable: true, unique: true })
  email: string | null;

  @Exclude()
  @Column('varchar', { length: 255, nullable: true, default: null })
  password: string | null;

  @Column('varchar', {
    length: 21,
    nullable: true,
    default: null,
    unique: true,
  })
  phone: string | null;

  @Column('boolean', { default: false })
  verified: boolean;

  @Column('boolean', { default: false })
  blocked: boolean;

  @Column('boolean', { default: false })
  deleted: boolean;

  @Column('boolean', { name: 'has_bot_access', default: true })
  hasBotAccess: boolean;

  @Column('varchar', { name: 'telegram_id', nullable: false, length: 100 })
  telegramId: string;

  @Column('varchar', { name: 'google_id', default: null, length: 100 })
  googleId: string | null;

  @Column('varchar', { name: 'facebook_id', default: null, length: 100 })
  facebookId: string | null;

  @Column('enum', { name: 'went_from', enum: UserWentFrom })
  wentFrom: UserWentFrom;

  @OneToMany(() => AccessTokenEntity, (token) => token.userId)
  tokens: AccessTokenEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  deletedAt: Date | null;

  public async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  public async comparePassword(candidate: string): Promise<boolean> {
    if (!this.password) {
      return false;
    }

    return bcrypt.compare(candidate, this.password);
  }

  toJSON() {
    return instanceToPlain(this) as UserModel;
  }
}
