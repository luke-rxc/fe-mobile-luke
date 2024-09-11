import { create, StoreApi, UseBoundStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import env from '@env';
import { ContentType } from '@constants/content';
import { ImageFileType } from '@constants/file';
import { WebHeaderHeight } from '@constants/ui';
import { FloatingStatusType, ShowroomType } from '../constants';
import type { ContentShowroomModel } from '../models';

/**
 * state auto selector
 * @reference https://github.com/pmndrs/zustand/blob/main/docs/guides/auto-generating-selectors.md
 */
type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

// eslint-disable-next-line @typescript-eslint/ban-types
const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

/**
 * @todo selector 개선
 */
export type ContentInfoState = {
  /** 콘텐츠 id */
  contentNo: number;
  /** 콘텐츠 명 */
  contentName: string;
  /** 콘텐츠 코드 */
  code: string;
  /** 콘텐츠 타입 */
  type: ContentType;
  /** 콘텐츠 딥링크 */
  deepLink: string;
  /** 미리보기 여부 */
  preview: boolean;
  /** 콘텐츠 미리보기 기준 시간 */
  dateTime: string;
};
export type ContentShowroomState = Omit<ContentShowroomModel, 'isFollow'>;
export type ContentPageViewState = {
  /** 모웹 헤더 사이즈 or 웹뷰 Top 시스템 영역 사이즈 */
  topBar: number;
  /** 네비게이션 컴포넌트 영역 사이즈 */
  navigationHeight: number;
};

/** 플로팅 노출 상태 */
export type ContentFloatingState = FloatingStatusType;

export type ContentNavigationState = {
  /** 네비게이션 노출 상태 */
  show: boolean;
  /** 활성화 id */
  activeId: number;
};

export type ContentReplyState = {
  /** 댓글 오픈 상태 */
  show: boolean;
};
type ContentValueState = {
  /** 로그인 여부 */
  login: boolean;
  /** 쇼룸 팔로우 여부 */
  followed: boolean;
  /** 콘텐츠 상태 정보 */
  contentInfo: ContentInfoState;
  /** 쇼룸 상태 정보 */
  showroom: ContentShowroomState;
  /** 페이지 뷰 정보 */
  pageView: ContentPageViewState;
  /** 플로팅 노출 상태 */
  floating: ContentFloatingState;
  /** 네비게이션 프리셋 정보 */
  navigation: ContentNavigationState;
  /** 댓글 프리셋 정보 */
  reply: ContentReplyState;
};
export type ContentState = ContentValueState & {
  /** 로그인 상태 업데이트 */
  setLoginState: (value: boolean) => void;
  /** 팔로우 상태 업데이트 */
  setFollowedState: (value: boolean) => void;
  /** 콘텐츠 상태 업데이트 */
  setContentInfoState: (value: ContentInfoState) => void;
  /** 쇼룸 상태 업데이트 */
  setShowroomState: (value: ContentShowroomState) => void;
  /** 페이지뷰 탑바 상태 업데이트 */
  setPageViewTopBarState: (value: number) => void;
  /** 플로팅 노출 상태 업데이트 */
  setFloatingState: (value: ContentFloatingState) => void;
  /** 네비게이션 오픈 상태 업데이트 */
  setNavigationShowState: (value: boolean) => void;
  /** 네비게이션 활성 메뉴 상태 업데이트 */
  setNavigationActiveMenuState: (value: number) => void;
  /** 댓글 오픈 상태 업데이트 */
  setReplyShowState: (value: boolean) => void;
  /** 초기화 */
  reset: () => void;
};

const initialState: ContentValueState = {
  login: false,
  followed: false,
  contentInfo: {
    contentNo: 0,
    contentName: '',
    code: '',
    type: ContentType.STORY,
    deepLink: '',
    preview: false,
    dateTime: '',
  },
  showroom: {
    id: 0,
    code: '',
    name: '',
    type: ShowroomType.NORMAL,
    primaryImage: {
      id: 0,
      path: '',
      blurHash: '',
      width: 0,
      height: 0,
      fileType: ImageFileType.IMAGE,
      extension: '',
    },
    tintColor: '',
    contentColor: '',
    backgroundColor: '',
    textColor: '',
    onAir: false,
    liveId: 0,
    liveTitle: '',
    isActive: false,
    brand: {
      id: 0,
      name: '',
      defaultShowRoomId: 0,
      primaryImage: {
        id: 0,
        path: '',
        blurHash: '',
        width: 0,
        height: 0,
        fileType: ImageFileType.IMAGE,
        extension: '',
      },
    },
  },
  pageView: {
    topBar: WebHeaderHeight * 2, // 네비게이션이 topInset 조회 전까지 최초 노출 되지 않도록 2배 값으로 초기 설정
    navigationHeight: 64,
  },
  floating: FloatingStatusType.SHOW,
  reply: {
    show: false,
  },
  navigation: {
    show: false,
    activeId: -1,
  },
};

const contentStore = (set: StoreApi<ContentState>['setState']) => ({
  ...initialState,
  setLoginState: (login: boolean) => {
    set({
      login,
    });
  },
  setFollowedState: (followed: boolean) => {
    set({
      followed,
    });
  },
  setContentInfoState: (contentInfo: ContentInfoState) => {
    set({
      contentInfo,
    });
  },
  setShowroomState: (showroom: ContentShowroomState) => {
    set({
      showroom,
    });
  },
  setPageViewTopBarState: (topBar: number) => {
    set((state: ContentState) => {
      return {
        pageView: { ...state.pageView, topBar },
      };
    });
  },
  setFloatingState: (floating: FloatingStatusType) => {
    set({
      floating,
    });
  },
  setNavigationShowState: (show: boolean) => {
    set((state: ContentState) => {
      return {
        navigation: { ...state.navigation, show },
      };
    });
  },
  setNavigationActiveMenuState: (activeId: number) => {
    set((state: ContentState) => {
      return {
        navigation: { ...state.navigation, activeId },
      };
    });
  },
  setReplyShowState: (show: boolean) => {
    set((state: ContentState) => {
      return {
        reply: { ...state.reply, show },
      };
    });
  },
  reset: () => {
    set(initialState);
  },
});

const useContent = create<ContentState>()(!env.isProduction ? devtools<ContentState>(contentStore) : contentStore);
export const useContentStore = createSelectors(useContent);
