export const LogEventTypes = {
  // 공지사항 > 공지 탭 페이지 뷰
  LogMyNoticeViewNotice: 'my_notice.view_notice',
  // 공지사항 > 공지 상세 뷰
  LogMyNoticeViewArticle: 'my_notice.view_article',
  // 공지사항 > 이벤트 탭 페이지 뷰
  LogMyEventViewEvent: 'my_event.view_event',
  // 공지사항 > 이벤트 상세 뷰
  LogMyEventViewArticle: 'my_event.view_article',
  // FAQ 페이지 뷰
  LogMyFaqViewFaq: 'my_faq.view_faq',
  // FAQ 상세 뷰
  LogMyFaqViewArticle: 'my_faq.view_article',
  // 문의하기 페이지 뷰
  LogMyQnaViewQna: 'my_qna.view_qna',
  // 전화 상담 신청 탭
  LogMyQnaTabCallRequest: 'my_qna.tab_call_request',
  // 전화 상담 철회 탭
  LogMyQnaTabCallCancel: 'my_qna.tab_call_cancel',
  // 추가 문의 버튼 탭
  LogMyQnaTabAddComment: 'my_qna.tab_add_comment',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LogEventTypes = ValueOf<typeof LogEventTypes>;
