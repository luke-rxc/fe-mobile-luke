/**
 * 컨텐츠 타입
 */
export const ContentType = {
  STORY: 'STORY', // 스토리
  TEASER: 'TEASER', // 라이브 티저
  EXCLUSIVE: 'EXCLUSIVE', // prizm id
  COLLABORATION: 'COLLABORATION', // prizm xx
  EVENT: 'EVENT', // asap
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ContentType = typeof ContentType[keyof typeof ContentType];

/**
 * string to contentType
 */
export const getContentType = (type: string): ContentType => {
  const contentType = type.toLowerCase();
  switch (contentType) {
    case 'story':
      return ContentType.STORY; // 스토리
    case 'teaser':
      return ContentType.TEASER; // 라이브 티저
    case 'exclusive':
      return ContentType.EXCLUSIVE; // prizm id
    case 'collaboration':
      return ContentType.COLLABORATION; // prizm xx
    case 'event':
      return ContentType.EVENT; // asap
    default:
      return ContentType.STORY;
  }
};

/** 콘텐츠 응모 이벤트 */
export const DrawEventType = {
  GOODS: 'GOODS',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DrawEventType = ValueOf<typeof DrawEventType>;

export interface DrawReceiveProps {
  type: DrawEventType;
  data: DrawReceiveDataProps;
}

export interface DrawReceiveDataProps {
  eventId?: number;
  isComplete?: boolean;
}
