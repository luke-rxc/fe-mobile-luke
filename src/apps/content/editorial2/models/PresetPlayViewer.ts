import { MediaViewerRatio } from '../constants';
import type { DisplayMediaModel, DisplayNavigationOptionModel, DisplayTimeOptionModel } from './Presets';

/**
 * 플레이뷰어 컴포넌트
 * - 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */

export type PlayViewerDisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    media: DisplayMediaModel; // 대표 미디어
    fullMode: boolean; // 영상 노출 타입 - 풀모드로 영상 노출
    mediaViewRatio: MediaViewerRatio | null; // 미디어 노출 비율 정보
  };
