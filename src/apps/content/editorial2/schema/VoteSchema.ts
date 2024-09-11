/** 투표하기 Schema */
export type VotedSchema = {
  nomineeId: number;
  nomineeVoteCount: number;
  allowedVoteCount: number;
  usedVoteCount: number;
};

export type VoteSuffrageSchema = {
  isAuthentication: boolean;
  authenticationType: 'MOBILE' | 'NONE';
  allowedVoteCount: number;
  usedVoteCount: number;
  isShared: boolean;
};
