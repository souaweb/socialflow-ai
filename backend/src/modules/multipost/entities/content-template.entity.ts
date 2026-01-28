import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('content_templates')
export class ContentTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  templateContent: string;

  @Column({
    type: 'enum',
    enum: ['post', 'reel', 'story', 'carousel', 'video'],
  })
  contentType: string;

  @Column({
    type: 'enum',
    enum: ['instagram', 'facebook', 'tiktok', 'youtube', 'whatsapp'],
    array: true,
  })
  applicableChannels: string[];

  @Column('simple-json')
  placeholders: {
    placeholder: string;
    description: string;
    type: 'text' | 'image' | 'video';
  }[];

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  successRate: number;

  @CreateDateColumn()
  createdAt: Date;
}
