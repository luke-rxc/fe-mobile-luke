import { FileType } from '@constants/file';
import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';

export interface FollowingItemResponse {
  backgroundColor: string;
  code: string;
  id: number;
  isActive: boolean;
  isFollowed: boolean;
  liveId?: number;
  liveTitle?: string;
  name: string;
  onAir: boolean;
  primaryImage: ImageResponse;
  textColor: string;
}

interface ImageResponse {
  blurHash?: string;
  fileType?: FileType;
  id: number;
  path: string;
  width?: number;
  height?: number;
}

/**
 * 구독 중인 쇼룸 - 아이템 Schema
 */
export type FollowingItemSchema = FollowingItemResponse;

/**
 * 구독 중인 쇼룸 - 목록 Schema
 */
export type FollowingListSchema = LoadMoreResponseSchema<FollowingItemSchema>;
