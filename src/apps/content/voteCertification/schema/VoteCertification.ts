export type VoteCertificationSchema = {
  isShared: boolean;
  title: string;
  certificationDate: number;
  logoImage: ImageSchema;
  backgroundImage: ImageSchema;
  backgroundVideo: MediaSchema;
  backgroundColor: string;
  buttonColor: string;
  buttonTextColor: string;
  nomineeList: VoteItemSchema[];
};

export type VoteItemSchema = {
  id: number;
  name: string;
  voteCount: number;
  primaryImage: ImageSchema;
};

/** 이미지 */
export type ImageSchema = {
  id: number;
  path: string;
  blurHash: string;
  width: number;
  height: number;
  extension: string;
  fileType: 'IMAGE' | 'LOTTIE';
};

/** 미디어 */
export type MediaSchema = ImageSchema & {
  thumbnailImage: ImageSchema;
  fileType: 'IMAGE' | 'VIDEO' | 'ETC';
  chromaKey: boolean;
};

export type VoteBenefitSchema = {
  benefitType: 'SHARE';
};
