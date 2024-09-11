import type { HTMLAttributes } from 'react';
import type { ComponentRefModel, ContentInfoModel, DisplayMediaModel, LandingActionModel } from './Presets';

/**
 * 배너 컴포넌트 타입
 */
export type BannerProps = BannerDisplayModel &
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
export type BannerDisplayModel = {
  image: DisplayMediaModel; // 메인이미지  정보
  actions: LandingActionModel; // 랜딩 액션
  useActions: boolean; // 랜딩 사용 여부
};
export type BannerComponentRefModel = ComponentRefModel;
