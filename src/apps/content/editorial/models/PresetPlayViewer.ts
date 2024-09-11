import type { HTMLAttributes } from 'react';
import { MediaViewerRatio } from '../constants';
import type {
  ComponentRefModel,
  ContentInfoModel,
  DisplayMediaModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
} from './Presets';

/**
 * 플레이뷰어 컴포넌트 타입
 */
export type PlayViewerProps = PlayViewerDisplayModel &
  Omit<HTMLAttributes<HTMLDivElement>, 'css'> & {
    contentInfo: ContentInfoModel;
    /** 미리보기시 기준시간 */
    displayDateTime: string;
    /** 컴포넌트 노출 여부 */
    visible: boolean;
  };

/**
 * 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type PlayViewerDisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    media: DisplayMediaModel; // 대표 미디어
    fullMode: boolean; // 영상 노출 타입 - 풀모드로 영상 노출
    mediaViewRatio: MediaViewerRatio | null; // 미디어 노출 비율 정보
  };
export type PlayViewerComponentRefModel = ComponentRefModel;
