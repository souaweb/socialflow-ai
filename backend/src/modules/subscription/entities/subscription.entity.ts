import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: ['free', 'starter', 'pro', 'enterprise'],
    default: 'free'
  })
  plan: 'free' | 'starter' | 'pro' | 'enterprise';

  @Column({
    type: 'enum',
    enum: ['active', 'paused', 'cancelled', 'expired'],
    default: 'active'
  })
  status: 'active' | 'paused' | 'cancelled' | 'expired';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'monthly' })
  billingCycle: 'monthly' | 'yearly';

  @CreateDateColumn()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column()
  nextBillingDate: Date;

  @Column({ default: true })
  autoRenew: boolean;

  @Column({ nullable: true })
  cancellationReason: string;

  @Column({ default: 0 })
  postsPerMonth: number;

  @Column({ default: 0 })
  teamMembersAllowed: number;

  @Column({ default: false })
  aiEnabled: boolean;

  @Column({ default: false })
  analyticsEnabled: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
