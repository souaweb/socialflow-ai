import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('affiliates')
export class Affiliate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;

  @Column({ unique: true })
  affiliateCode: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  })
  status: 'active' | 'inactive' | 'suspended';

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 20 })
  commissionRate: number;

  @Column({ default: 0 })
  totalInvites: number;

  @Column({ default: 0 })
  totalConversions: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalEarnings: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  pendingBalance: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  paidBalance: number;

  @Column({ default: 0 })
  conversionRate: number;

  @Column({ nullable: true })
  bankAccount: string;

  @Column({ nullable: true })
  bankCode: string;

  @Column({ nullable: true })
  cpf: string;

  @Column({ nullable: true })
  lastPaymentDate: Date;

  @Column({ default: 500 })
  minimumPaymentThreshold: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
