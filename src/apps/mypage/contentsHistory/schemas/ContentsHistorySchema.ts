import { ContentType } from '@constants/content';
import { FileType } from '@constants/file';
import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';

interface ContentsResponse {
  code: string;
  contentType: Lowercase<ContentType>;
  endDate?: number;
  id: number;
  image: ImageResponse;
  isActive: boolean;
  name: string;
  showRoom: ShowroomResponse;
  startDate: number;
  type: ContentType;
}

interface ShowroomResponse {
  backgroundColor: string;
  code: string;
  id: number;
  isActive: boolean;
  name: string;
  primaryImage: ImageResponse;
  textColor: string;
}

interface ImageResponse {
  blurHash?: string;
  fileType?: FileType;
  height?: number;
  id: number;
  path: string;
  width?: number;
}

/**
 * 최근 본 콘텐츠 - 아이템 Schema
 */
export type ContentsItemSchema = ContentsResponse;

/**
 * 최근 본 콘텐츠 - 목록 Schema
 */
export type ContentsHistoryListSchema = LoadMoreResponseSchema<ContentsItemSchema>;
