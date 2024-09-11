import type { HTMLAttributes } from 'react';
import type { BackgroundInfoModel, ComponentRefModel, ContentInfoModel, DisplayNavigationOptionModel } from './Presets';

/**
 * 투표A 컴포넌트 타입
 */
export type VoteAProps = VoteADisplayModel &
  HTMLAttributes<HTMLDivElement> & {
    contentInfo: ContentInfoModel;
    vote: VoteModel | null;
    /** 컴포넌트 노출 여부 */
    visible: boolean;
  };
export type VoteADisplayModel = DisplayNavigationOptionModel & {
  /** 텍스트 컬러 */
  color: string;
  /** 백그라운드 정보 */
  backgroundInfo: BackgroundInfoModel;
  /** cta 컬러 */
  button: VoteDisplayButtonModel;
};
export type VoteDisplayButtonModel = {
  background: string;
  color: string;
  label: string;
};
export type VoteAComponentRefModel = ComponentRefModel;

export type VoteModel = {
  /** 투표 id */
  id: number;
  /** 투표명 */
  title: string;
  /** 투표 시작일 */
  startDate: number;
  /** 투표 종료일 */
  endDate: number;
  /** 투표 항목 리스트 */
  voteList: VoteItemModel[];
};

/** 투표 항목 */
export type VoteItemModel = {
  /** 항목 id */
  id: number;
  /** 항목명 */
  name: string;
  /** 투표 이미지 */
  primaryImage: {
    id: number;
    path: string;
    blurHash: string;
    width: number;
    height: number;
    extension: string;
    fileType: 'IMAGE' | 'LOTTIE';
  };
  /** 투표 총수 */
  voteCount: number;
};

export type VoteReceiveModel = {
  type: string;
  data: VoteReceiveDataModel;
};

export type VoteReceiveDataModel = {
  title: string;
  voteId: number;
  voteItemId: number;
};
