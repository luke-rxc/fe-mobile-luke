import { baseApiClient } from '@utils/api';
import type { VoteBenefitSchema, VoteCertificationSchema } from '../schema';

/** 투표권 인증서 조회 */
export const getVoteCertification = (voteId: number): Promise<VoteCertificationSchema> => {
  return baseApiClient.get(`/v1/vote/${voteId}/certification`);
};

/** 투표 추가 획득 */
export const getBenefitVote = (voteId: number): Promise<VoteBenefitSchema> => {
  const params = {
    benefitType: 'SHARE',
  };
  return baseApiClient.post(`/v1/vote/${voteId}/benefit`, params);
};
