import type { BackgroundInfoModel, DisplayNavigationOptionModel } from './Presets';

/**
 * 투표A 컴포넌트 타입
 */

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

export type VoteReceiveModel = {
  type: string;
  data: VoteReceiveDataModel;
};

export type VoteReceiveDataModel = {
  title: string;
  voteId: number;
  voteItemId: number;
};
