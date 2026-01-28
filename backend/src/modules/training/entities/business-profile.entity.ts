import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('business_profiles')
export class BusinessProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @Column({
    type: 'enum',
    enum: [
      'consultoria',
      'ecommerce',
      'agencia_marketing',
      'saas',
      'educacao',
      'saude',
      'fitness',
      'restaurante',
      'imobiliario',
      'servicos',
      'varejo',
      'outro',
    ],
  })
  businessType: string;

  @Column({ nullable: true })
  businessName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  targetAudience: string[];

  @Column('simple-array', { nullable: true })
  keywords: string[];

  @Column('simple-json', { nullable: true })
  tone: {
    formal: number;
    friendly: number;
    technical: number;
    casual: number;
  };

  @Column('simple-json', { nullable: true })
  specialties: Record<string, boolean>;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  trainingScore: number;

  @Column({ default: 0 })
  totalTrainingInputs: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
