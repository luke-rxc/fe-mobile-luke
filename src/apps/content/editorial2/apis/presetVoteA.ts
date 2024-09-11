import { baseApiClient } from '@utils/api';
import { VotedSchema, VoteSuffrageSchema } from '../schema';

/** 투표권 조회 */
export const getSuffrage = (voteId: number): Promise<VoteSuffrageSchema> => {
  return baseApiClient.get(`/v1/vote/${voteId}/suffrage`);
};

/** 투표하기 */
export const postVoteItem = (voteId: number, voteItemId: number): Promise<VotedSchema> => {
  return baseApiClient.post(`/v1/vote/${voteId}/nominee/${voteItemId}`);
};

/** TODO: 제거 삭제하기 */
export const deleteVoteItem = (voteId: number): Promise<VotedSchema> => {
  return baseApiClient.delete(`/v1/vote/${voteId}/nominee`);
};
