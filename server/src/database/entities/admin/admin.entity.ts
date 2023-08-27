/*external modules*/
import bcrypt from 'bcrypt';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { instanceToPlain, Exclude } from 'class-transformer';
/*@entities*/
import { AccessTokenEntity } from '@entities/accessToken';
import { AdminModel } from '@entities/admin/admin.model';

@Entity({ name: 'admins', schema: 'public' })
export class AdminEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @Column('citext', { nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column('varchar', { length: 255, nullable: false })
  password: string;

  @OneToMany(() => AccessTokenEntity, (token) => token.userId)
  tokens: AccessTokenEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

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
    return instanceToPlain(this) as AdminModel;
  }
}
