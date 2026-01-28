import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ai_responses')
export class AIResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @Column({ type: 'text' })
  originalMessage: string;

  @Column({ type: 'text' })
  generatedResponse: string;

  @Column({ nullable: true })
  trainingDataUsed: string;

  @Column({
    type: 'enum',
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  })
  qualityRating: 'high' | 'medium' | 'low';

  @Column({ default: false })
  userApproved: boolean;

  @Column({ nullable: true })
  userFeedback: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  confidenceScore: number;

  @CreateDateColumn()
  createdAt: Date;
}
