import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('multi_posts')
@Index(['businessId', 'status'])
export class MultiPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @Column({ type: 'text' })
  originalContent: string;

  @Column({
    type: 'enum',
    enum: ['instagram', 'facebook', 'tiktok', 'youtube', 'whatsapp'],
    array: true,
  })
  targetChannels: string[];

  @Column({
    type: 'enum',
    enum: ['post', 'reel', 'story', 'carousel', 'video'],
  })
  contentType: 'post' | 'reel' | 'story' | 'carousel' | 'video';

  @Column('simple-json')
  adaptedContent: {
    [channel: string]: {
      text: string;
      format: string;
      hashtags: string[];
      mediaType: string;
      dimensions: string;
      duration?: number;
    };
  };

  @Column('simple-array', { nullable: true })
  mediaUrls: string[];

  @Column({
    type: 'enum',
    enum: ['draft', 'scheduled', 'publishing', 'published', 'failed'],
    default: 'draft',
  })
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';

  @Column({ nullable: true })
  scheduledAt: Date;

  @Column({ default: false })
  aiGenerated: boolean;

  @Column({
    type: 'enum',
    enum: ['text', 'image', 'video', 'carousel', 'mixed'],
    nullable: true,
  })
  aiContentType?: 'text' | 'image' | 'video' | 'carousel' | 'mixed';

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  optimizationScore: number;

  @Column('simple-json', { nullable: true })
  publishResults: {
    [channel: string]: {
      success: boolean;
      postId: string;
      url: string;
      publishedAt: Date;
      error?: string;
    };
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
