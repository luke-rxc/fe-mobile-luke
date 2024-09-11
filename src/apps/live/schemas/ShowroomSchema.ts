import { ImageSchema } from './LiveSchema';

/**
 * 쇼룸 심플 schema
 */
export interface ShowroomSimpleSchema {
  id: number;
  code: string;
  name: string;
  primaryImage: ImageSchema;
  type: 'NORMAL' | 'PGM' | 'CONCEPT';
  backgroundColor?: string;
  textColor: string;
  tintColor: string;
  onAir: boolean;
  liveId: number;
  liveTitle: string;
  isActive: boolean;
  isFollowed: boolean;
}
