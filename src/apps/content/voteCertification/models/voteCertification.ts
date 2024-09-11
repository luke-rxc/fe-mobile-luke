import type { VoteCertificationSchema } from '../schema';

export const toVoteCertificationModel = (data: VoteCertificationSchema): VoteCertificationModel => {
  const {
    isShared,
    title,
    certificationDate,
    logoImage,
    backgroundImage,
    backgroundVideo,
    backgroundColor,
    buttonColor,
    buttonTextColor,
    nomineeList,
  } = data;
  return {
    isShared,
    title,
    certificationDate,
    logoImage,
    backgroundImage,
    backgroundVideo,
    backgroundColor,
    buttonColor,
    buttonTextColor,
    voteList: nomineeList,
    // eslint-disable-next-line no-nested-ternary
    backgroundType: backgroundVideo?.path ? 'VIDEO' : backgroundImage?.path ? 'IMAGE' : 'COLOR',
  };
};

export type VoteCertificationModel = {
  /** 투표 공유 여부 */
  isShared: boolean;
  /** 투표 타이틀 */
  title: string;
  /** 투표 날짜 */
  certificationDate: number;
  /** 푸터 로고 이미지 */
  logoImage: ImageModel;
  /** 백그라운드 이미지 */
  backgroundImage: ImageModel | null;
  /** 백그라운드 비디오 */
  backgroundVideo: MediaModel | null;
  /** 백그라운드 컬러 */
  backgroundColor: string;
  /** CTA 백그라운드 컬러 */
  buttonColor: string;
  /** CTA 백그라운드 텍스트 컬러 */
  buttonTextColor: string;
  /** 투표 리스트 */
  voteList: VoteItemModel[];
  /** 백그라운드 타입 */
  backgroundType: 'IMAGE' | 'VIDEO' | 'COLOR';
};

export type VoteItemModel = {
  id: number;
  name: string;
  voteCount: number;
  primaryImage: ImageModel;
};

/** 이미지 */
export type ImageModel = {
  id: number;
  path: string;
  blurHash: string;
  width: number;
  height: number;
  extension: string;
  fileType: 'IMAGE' | 'LOTTIE';
};

/** 미디어 */
export type MediaModel = Omit<ImageModel, 'fileType'> & {
  thumbnailImage: ImageModel;
  fileType: 'IMAGE' | 'VIDEO' | 'ETC';
  chromaKey: boolean;
};
