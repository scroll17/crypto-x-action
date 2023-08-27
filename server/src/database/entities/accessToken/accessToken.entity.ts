/*external modules*/
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Lookup } from 'geoip-lite';
/*@entities*/
import { UserEntity } from '../user';
import { AdminEntity } from '@entities/admin';

@Entity({ name: 'accessTokens', schema: 'public' })
export class AccessTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json', { name: 'log_from', nullable: true })
  logFrom: Lookup | null;

  @Column('text', { name: 'log_from_ip', nullable: false })
  logFromIP: string;

  @ManyToOne(() => UserEntity, (user) => user.tokens, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userId: number | null;

  @ManyToOne(() => AdminEntity, (admin) => admin.tokens, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'admin_id' })
  adminId: number | null;

  @Column('int4', { name: 'live_time', nullable: false })
  liveTime: number;

  @Column({
    name: 'last_used_at',
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  lastUsedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;
}
