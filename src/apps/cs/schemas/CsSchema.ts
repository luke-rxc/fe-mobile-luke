import type { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import type {
  ZendeskArticleResponse,
  ZendeskArticleDetailResponse,
  ZendeskSectionsResponse,
  ZendeskTicketResponse,
  ZendeskTicketDetailResponse,
  ZendeskFieldDropdownResponse,
  ZendeskTicketOrderTemplateResponse,
  ZendeskUploadResponse,
} from './ApiSchema';

/**
 * 젠데스크 게시글 목록 아이템
 */
export type ArticleListItemSchema = ZendeskArticleResponse;

/**
 * 젠데스크 게시글 목록
 */
export type ArticleListSchema = LoadMoreResponseSchema<ArticleListItemSchema>;

/**
 * 젠데스크 게시글 상세
 */
export type ArticleDetailSchema = ZendeskArticleDetailResponse;

/**
 * 젠데스크 카테고리의 섹션
 */
export type SectionSchema = ZendeskSectionsResponse;

/**
 * 젠데스크 카테고리의 섹션 목록
 */
export type SectionListSchema = SectionSchema[];

/**
 * 젠데스크 문의 목록
 */
export type QnaListSchema = ZendeskTicketResponse[];

/**
 * 젠데스크 문의 상세
 */
export type QnaDetailSchema = ZendeskTicketDetailResponse;

/**
 * 젠데스크 문의 등록시 분류 드롭다운 조회
 */
export type QnaFieldsSchema = ZendeskFieldDropdownResponse;

/**
 * 젠데스크 주문 문의 등록시 분류에 따른 템플릿 조회
 */
export type QnaOrderTemplate = ZendeskTicketOrderTemplateResponse;

/**
 * 젠데스크 문의 등록시 참부파일 사전 업로드
 */
export type QnaUploadSchema = ZendeskUploadResponse;
