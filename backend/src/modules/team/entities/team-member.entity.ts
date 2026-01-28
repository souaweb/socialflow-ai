import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'manager', 'analyst', 'viewer'],
    default: 'viewer'
  })
  role: 'admin' | 'manager' | 'analyst' | 'viewer';

  @Column('simple-array', { default: [] })
  permissions: string[];

  @Column({ nullable: true })
  invitedBy: string;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  invitedAt: Date;

  @Column({ nullable: true })
  acceptedAt: Date;

  @Column({ nullable: true })
  lastLogin: Date;
}
