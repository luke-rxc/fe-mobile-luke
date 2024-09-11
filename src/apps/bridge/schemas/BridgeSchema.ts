// 이미지 Schema
interface ImageResponse {
  id: number;
  path: string;
  blurHash?: string;
  width?: number;
  height?: number;
  fileType?: 'IMAGE' | 'LOTTIE';
  extension?: string;
}

// 키워드 Schema
interface KeywordResponse {
  id: number;
  name: string;
}

// 뜨릴 기본 정보 Schema
interface ThrillBriefResponse {
  id: number;
  code: string;
  description?: string;
  thumbnail?: ImageResponse;
  keywordList?: KeywordResponse[];
}

export type ThrillSimpleSchema = ThrillBriefResponse;
