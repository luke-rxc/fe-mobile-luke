import type { HTMLAttributes } from 'react';
import type {
  ComponentRefModel,
  ContentInfoModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
} from './Presets';

/**
 * 여백 컴포넌트 타입
 */
export type BlankProps = BlankDisplayModel &
  HTMLAttributes<HTMLDivElement> & {
    contentInfo: ContentInfoModel;
    /** 미리보기시 기준시간 */
    displayDateTime: string;
    /** 컴포넌트 노출 여부 */
    visible: boolean;
  };

/**
 * 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type BlankDisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    height: number;
    colors?: string[];
  };
export type BlankComponentRefModel = ComponentRefModel;
