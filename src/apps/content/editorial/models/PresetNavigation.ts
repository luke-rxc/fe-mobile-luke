import type { HTMLAttributes } from 'react';
import type { ComponentRefModel, ContentInfoModel, ShowroomModel } from './Presets';

/**
 * 네비게이션 컴포넌트 타입
 */
export type NavigationProps = NavigationDisplayModel &
  HTMLAttributes<HTMLDivElement> & {
    contentInfo: ContentInfoModel;
    showroom: ShowroomModel;
    navigationList?: NavigationItemModel[];
    /** 컴포넌트 노출 여부 */
    visible: boolean;
  };

/**
 * 유저향 화면 요소에 대한 오피스와 프론트의 공통 인터페이스
 */
export type NavigationDisplayModel = {
  tabBackgroundColor: string; // 탭 배경색
  tabTextColor: string; // 탭 텍스트 컬러
};

export type NavigationComponentRefModel = ComponentRefModel & {
  /** 네비 메뉴 활성화 */
  active: (id: number) => void;
  /** 네비 노출 */
  show: (visible: boolean) => void;
};

export type NavigationItemModel = {
  // anchor target 컴포넌트의 index를 id로 처리
  id: number;
  // 탭 노출 시 라벨
  label: string;
};
