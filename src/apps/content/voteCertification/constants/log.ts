export const LogEventTypes = {
  // 인증서보기 진입
  LogVoteCertificationInit: 'contents.view_vote_certificate',
  // 공유 버튼 탭
  LogVoteShareButtonTab: 'contents.tab_vote_share',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = ValueOf<typeof LogEventTypes>;
