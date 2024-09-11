import type { DisplayNavigationOptionModel, DisplayTimeOptionModel } from './Presets';

/**
 * 여백 컴포넌트
 * - 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type BlankDisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    height: number;
    colors?: string[];
  };
