import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  password_hash: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ default: 'free' })
  plan: 'free' | 'starter' | 'pro' | 'consultancy';

  @Column({ default: false })
  identity_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
