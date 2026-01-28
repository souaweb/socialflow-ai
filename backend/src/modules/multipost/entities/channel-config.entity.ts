import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('channel_configs')
export class ChannelConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @Column()
  channel: string;

  @Column('simple-json')
  specifications: {
    maxTextLength: number;
    recommendedImageSize: string;
    videoFormats: string[];
    videoDuration: { min: number; max: number };
    supportedFormats: string[];
    aspectRatios: string[];
    features: string[];
  };

  @Column('simple-json')
  defaultSettings: {
    addHashtags: boolean;
    addEmojis: boolean;
    addCTA: boolean;
    mentionStyle: string;
  };

  @Column('simple-json')
  bestPractices: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
