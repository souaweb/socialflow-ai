import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('training_data')
@Index(['businessId', 'businessType'])
export class TrainingData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @Column({
    type: 'enum',
    enum: ['text', 'voice', 'file', 'url'],
  })
  inputType: 'text' | 'voice' | 'file' | 'url';

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ type: 'text', nullable: true })
  transcription: string;

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

  @Column('simple-json', { nullable: true })
  extractedKeywords: { keyword: string; frequency: number }[];

  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  quality: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
