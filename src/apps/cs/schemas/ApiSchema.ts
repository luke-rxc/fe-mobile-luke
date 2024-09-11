import type { TicketStatus } from '../constants';

/**
 * @see /v1/zendesk/articles
 */
export interface ZendeskArticleResponse {
  authorId: number;
  body: string;
  commentsDisabled: boolean;
  createdAt: number;
  draft: boolean;
  editedAt: number;
  htmlUrl: string;
  id: number;
  labelNames: string[];
  locale: string;
  outdated: boolean;
  outdatedLocales: string[];
  position: number;
  promoted: boolean;
  sectionId: number;
  sectionName: string;
  sourceLocale: string;
  title: string;
  updatedAt: number;
  url: string;
}

/**
 * @see /v1/zendesk/articles/[articleId]
 */
export interface ZendeskArticleDetailResponse {
  attachments: ZendeskArticleAttachment[];
  authorId: number;
  body: string;
  commentsDisabled: boolean;
  createdAt: number;
  draft: boolean;
  editedAt: number;
  htmlUrl: string;
  id: number;
  labelNames: string[];
  locale: string;
  outdated: boolean;
  outdatedLocales: string[];
  position: number;
  promoted: boolean;
  sectionId: number;
  sectionName: string;
  sourceLocale: string;
  title: string;
  updatedAt: number;
  url: string;
}

export interface ZendeskArticleAttachment {
  // 게시글 아이디
  articleId: number;
  // 파일컨텐츠 타입
  contentType: string;
  // 원본 경로
  contentUrl: string;
  // 등록시간
  createdAt: number;
  // 파일명
  fileName: string;
  // 아이디
  id: number;
  // inline
  inline: boolean;
  // 파일사이즈
  size: number;
  // 수정시간
  updatedAt: number;
  // URL
  url: string;
}

/**
 * @see /v1/zendesk/categories/[categoryId]/sections
 */
export interface ZendeskSectionsResponse {
  categoryId: number;
  createdAt: number;
  description: string;
  id: number;
  name: string;
}

/**
 * @see /v1/zendesk/requests
 */
export interface ZendeskTicketResponse {
  createdAt: number;
  customFields: Array<{ id: number; value: string[] }>;
  description: string;
  id: number;
  organizationId: number;
  priority: 'HIGH' | 'LOW' | 'NORMAL' | 'URGENT';
  requesterId: number;
  solved: boolean;
  status: TicketStatus;
  subject: string;
  type: 'INCIDENT' | 'PROBLEM' | 'QUESTION' | 'TASK';
  updatedAt: number;
  url: string;
}

/**
 * @see /v1/zendesk/requests/[requestId]
 */
export interface ZendeskTicketDetailResponse {
  comments: ZendeskTicketCommentResponse[];
  createdAt: number;
  customFields: Array<{ id: number; value?: string }>;
  description: string;
  goods?: ZendeskTicketDetailGoodsResponse;
  id: number;
  organizationId: number;
  priority: 'HIGH' | 'LOW' | 'NORMAL' | 'URGENT';
  requesterId: number;
  solved: boolean;
  status: TicketStatus;
  subject: string;
  type: 'INCIDENT' | 'PROBLEM' | 'QUESTION' | 'TASK';
  updatedAt: number;
  url: string;
}

export interface ZendeskTicketCommentResponse {
  attachments: ZendeskAttachmentResponse[];
  authorId: number;
  body: string;
  createdAt: number;
  htmlBody: string;
  id: number;
  public: boolean;
  uploads?: string[];
}

export interface ZendeskTicketDetailGoodsResponse {
  id: number;
  name: string;
  primaryImage: ImageResponse;
}

export interface ImageResponse {
  blurHash?: string;
  extension?: string;
  fileType?: 'IMAGE' | 'LOTTIE';
  height?: number;
  id: number;
  path: string;
  width?: number;
}

export interface ZendeskAttachmentResponse {
  contentType: string;
  contentUrl: string;
  fileName: string;
  height: number;
  id: number;
  inline: boolean;
  mappedContentUrl: string;
  size: number;
  thumbnails: ThumbnailRxc[];
  url: string;
  width: number;
}

export interface ThumbnailRxc {
  contentType: string;
  contentUrl: string;
  fileName: string;
  height: number;
  id: number;
  inline: boolean;
  mappedContentUrl: string;
  size: number;
  url: string;
  width: number;
}

/**
 * @see /v1/zendesk/ticket-fields/[fieldType]
 */
export interface ZendeskFieldDropdownResponse {
  id: number;
  options: Array<{ name: string; value: string }>;
  title: string;
}

/**
 * @see /v1/zendesk/requests/order-template
 */
export interface ZendeskTicketOrderTemplateResponse {
  text: string;
}

/**
 * @see /v1/zendesk/upload
 */
export interface ZendeskUploadResponse {
  thumbnail: {
    contentType: string;
    contentUrl: string;
    fileName: string;
    height: number;
    id: number;
    mappedContentUrl: string;
    size: number;
    url: string;
    width: number;
  };
  token: string;
}
