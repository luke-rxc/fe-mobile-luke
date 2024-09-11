import { VideoEventMap } from '../constants';

export type VideoEventKey = keyof typeof VideoEventMap;
export type VideoEventValue = (e: Event) => void;
export type VideoEventCallbackType = Partial<Record<VideoEventKey, VideoEventValue>>;

export type VideoControllerRef = {
  ref: HTMLDivElement;
  fadeIn: () => void;
  reset: () => void;
};

/** 비디오 시청시간 */
export type VideoViewingTimeModel = {
  /** 총 재생 시간 */
  totalViewTime: number;
  /** 현재 타임라인 */
  currentViewTime: number;
  /** 재생 여부 */
  isStartedPlay: boolean;
};
