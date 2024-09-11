import type { HTMLAttributes } from 'react';
import type {
  ComponentRefModel,
  ContentInfoModel,
  DisplayNavigationOptionModel,
  DisplayTimeOptionModel,
} from './Presets';

/**
 * 임베드 비디오 A 컴포넌트 타입
 */
export type EmbedVideoAProps = EmbedVideoADisplayModel &
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
export type EmbedVideoADisplayModel = DisplayTimeOptionModel &
  DisplayNavigationOptionModel & {
    /** 임베드 타입 */
    embedType: string;
    /** 영상 id */
    embedId: string;
    /** 영상 링크 */
    link: string;
  };
export type EmbedVideoAComponentRefModel = ComponentRefModel;
