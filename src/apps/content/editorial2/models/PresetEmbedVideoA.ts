import type { DisplayNavigationOptionModel, DisplayTimeOptionModel } from './Presets';

/**
 * 임베드 비디오(유튜브) 컴포넌트
 * - 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type EmbedVideoADisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    /** 임베드 타입 */
    embedType: string;
    /** 영상 id */
    embedId: string;
    /** 영상 링크 */
    link: string;
  };
