export const QueryKeys = {
  MAIN: 'CS',
  ARTICLE_LIST: 'ARTICLE_LIST',
  ARTICLE_DETAIL: 'ARTICLE_DETAIL',
  SECTION_LIST: 'SECTION_LIST',
  QNA_LIST: 'QNA_LIST',
  QNA_DETAIL: 'QNA_DETAIL',
  TICKET_FIELDS: 'TICKET_FIELDS',
  ORDER_TEMPLATE: 'ORDER_TEMPLATE',
} as const;

// 카테고리 ID 목록
export const CategoryIds = {
  // 공지사항 카테고리 ID
  NOTICE: 4407749576729,
  // FAQ 카테고리 ID
  FAQ: 4407753074969,
};

// 섹션 ID 목록 (공지사항 카테고리에서 사용)
export const SectionIds = {
  // 공지 탭
  NOTICE: 4407760525977,
  // 이벤트 탭
  EVENT: 4407753226265,
};

// 티켓 상태
export const TicketStatus = {
  NEW: 'NEW',
  OPEN: 'OPEN',
  PENDING: 'PENDING',
  HOLD: 'HOLD',
  SOLVED: 'SOLVED',
  CLOSED: 'CLOSED',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TicketStatus = ValueOf<typeof TicketStatus>;

// 티켓 상태 그룹
export const TicketStatusGroup = {
  // 답변 대기
  WAITING: 'WAITING',
  // 답변 완료
  COMPLETE: 'COMPLETE',
  // 문의 종료
  END: 'END',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TicketStatusGroup = ValueOf<typeof TicketStatusGroup>;

export const TicketStatusGroupLabel = {
  [TicketStatusGroup.WAITING]: '답변대기',
  [TicketStatusGroup.COMPLETE]: '답변완료',
  [TicketStatusGroup.END]: '문의종료',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TicketStatusGroupLabel = ValueOf<typeof TicketStatusGroupLabel>;

// 문의 타입
export const RequestTypes = {
  // 일반 문의
  GENERAL: 'general',
  // 상품 문의
  GOODS: 'goods',
  // 주문 문의
  ORDER: 'order',
  // 추가 문의
  ADDITIONAL: 'additional',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type RequestTypes = ValueOf<typeof RequestTypes>;

// 커스텀 필드 목록
export const FieldIds = {
  // 유선 상담 상태 필드
  OUTGOING_CALL_STATUS: 33620047431065,
} as const;

// 유선 상담 상태 목록
export const OutgoingCallStatus = {
  // 상담 신청 불가
  NONE: 'NONE',
  // 상담 신청 가능
  REQUESTABLE: 'REQUESTABLE',
  // 상담 신청 완료
  REQUESTED: 'REQUESTED',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OutgoingCallStatus = ValueOf<typeof OutgoingCallStatus>;

// 주문 문의의 교환/반품 유형 템플릿 코드
export const OrderTemplateTypes = {
  EXCHANGE: 'EXCHANGE',
  RETURN: 'RETURN',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OrderTemplateTypes = ValueOf<typeof OrderTemplateTypes>;

// 주문 문의 유형 템플릿 매핑 코드
export const MappedOrderTemplateTypes = new Map<string, string>([
  ['교환', OrderTemplateTypes.EXCHANGE],
  ['반품', OrderTemplateTypes.RETURN],
]);

// 파일 업로드 제한수
export const UPLOAD_FILE_MAX_COUNT = 10;
export const UPLOAD_FILE_MAX_COUNT_MESSAGE = `파일 첨부는 최대 ${UPLOAD_FILE_MAX_COUNT}개까지 등록 가능합니다`;

// 파일 업로드 크기 제한 (10MB)
export const UPLOAD_FILE_MAX_SIZE = 10485760;
export const UPLOAD_FILE_MAX_SIZE_MESSAGE = `10MB 이하의 사진만 첨부할 수 있습니다`;

// 젠데스크 Link를 Prizm 호환 Link로 처리하기 위한 매칭 URL
export const ZENDESK_TO_PRIZM_LINK_MATCH_KEY = '//prizm.co.kr/cs/link';
