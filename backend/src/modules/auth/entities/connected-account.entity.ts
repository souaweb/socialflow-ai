import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('connected_accounts')
export class ConnectedAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  platform: 'instagram' | 'facebook' | 'whatsapp' | 'tiktok' | 'youtube' | 'kwai';

  @Column()
  platform_account_id: string;

  @Column()
  access_token: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  token_expires_at: Date;

  @Column({ nullable: true })
  business_name: string;

  @Column({ nullable: true })
  business_avatar: string;

  @Column({ default: false })
  is_verified: boolean;

  @CreateDateColumn()
  connected_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
