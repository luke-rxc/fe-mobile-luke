import { LiveContentsType } from '@constants/live';
import { MediaSchema } from '@schemas/mediaSchema';
import { ShowroomSimpleSchema } from './ShowroomSchema';

/**
 * 편성표 image schema
 */
export interface ScheduleImageSchema {
  blurHash: string;
  height: number;
  id: number;
  path: string;
  width: number;
  fileType: string;
}

/**
 * 편성표 item schema
 */
export interface ScheduleItemSchema {
  id: number;
  scheduleDate: number;
  type: string; // 'LIVE';
  title: string;
  subtitle: string;
  scheme: string;
  bgImage: ScheduleImageSchema;
  chromakeyImage: ScheduleImageSchema;
  bgColor: string;
  lottieLogo: ScheduleImageSchema;
  svgLogo?: ScheduleImageSchema;
  liveSchedule: {
    live: {
      id: number;
      contentsType: LiveContentsType;
      title: string;
      coverImage: ScheduleImageSchema;
      onAir: boolean;
      liveStartDate: number;
      videoUrl: string;
    };
    isFollowed: boolean;
  };
  showRoom: ShowroomSimpleSchema;
  landingStory: { code: string; contentsType: string };
  landingType: 'SCHEDULE_TEASER' | 'STORY';
}

/**
 * 라이브 피드 섹션 item schema
 */
export interface LiveFeedSectionItemSchema {
  metadata: {
    id: number;
    title: string;
    subTitle: string;
    sort: string;
    headerList?: {
      id?: number;
      title?: string;
      subTitle?: string;
      media: MediaSchema;
    }[];
  };
  content: Array<ScheduleItemSchema>;
  nextParameter: string;
}
