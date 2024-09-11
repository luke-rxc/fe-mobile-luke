import qs from 'qs';
import { baseApiClient, baseFormMultipartApi } from '@utils/api';
import { createDebug } from '@utils/debug';
import type { OutgoingCallStatus } from '../constants';
import {
  ArticleListSchema,
  ArticleDetailSchema,
  SectionListSchema,
  QnaListSchema,
  QnaDetailSchema,
  QnaFieldsSchema,
  QnaOrderTemplate,
  QnaUploadSchema,
} from '../schemas';

const debug = createDebug('cs:apis:cs');

/**
 * 젠데스크 게시글 목록 조회 Request Parameters
 */
interface GetArticleListParams {
  sectionId: number;
  size?: number;
  nextParameter?: string;
}

/**
 * 젠데스크 게시글 목록 조회 API
 *
 * @description 젠데스크 카테고리 섹션에 등록된 게시글을 조회합니다. (공지/이벤트/FAQ 등)
 */
export const getArticleList = ({ nextParameter, ...params }: GetArticleListParams): Promise<ArticleListSchema> => {
  debug.log('getArticleList', nextParameter, params);

  return baseApiClient.get('/v1/zendesk/articles', { ...params, ...qs.parse(nextParameter ?? '') });
};

/**
 * 젠데스크 게시글 상세 조회 Request Parameters
 */
interface GetArticleDetailParams {
  articleId: number;
}

/**
 * 젠데스크 게시글 상세 조회 API
 *
 * @description 젠데스크 카테고리 섹션에 등록된 게시글의 상세 정보를 조회합니다. (공지/이벤트/FAQ 등)
 */
export const getArticleDetail = ({ articleId }: GetArticleDetailParams): Promise<ArticleDetailSchema> => {
  debug.log('getArticleDetail', articleId);

  return baseApiClient.get(`/v1/zendesk/articles/${articleId}`);
};

/**
 * 젠데스크 섹션 목록 조회 Request Parameters
 */
interface GetSectionListParams {
  categoryId: number;
}

/**
 * 젠데스크 섹션 목록 조회 API
 *
 * @description 젠데스크 카테고리에 포함된 섹션 목록을 조회합니다.
 */
export const getSectionList = ({ categoryId }: GetSectionListParams): Promise<SectionListSchema> => {
  debug.log('getSectionList', categoryId);

  return baseApiClient.get(`/v1/zendesk/categories/${categoryId}/sections`);
};

/**
 * 젠데스크 문의 목록 조회 API
 */
export const getQnaList = (): Promise<QnaListSchema> => {
  debug.log('getQnaList');

  return baseApiClient.get('/v1/zendesk/requests');
};

/**
 * 젠데스크 문의 상세 내역 조회 Request Parameters
 */
interface GetQnaDetailParams {
  requestId: number;
}

/**
 * 젠데스크 문의 상세 내역 조회 API
 */
export const getQnaDetail = ({ requestId }: GetQnaDetailParams): Promise<QnaDetailSchema> => {
  debug.log('getQnaDetail', requestId);

  return baseApiClient.get(`/v1/zendesk/requests/${requestId}`);
};

/**
 * 젠데스크 일반문의 등록 Request Parameters
 */
export interface CreateQnaRegisterGeneralParams {
  // 문의내용
  body: string;
  // 문의유형
  inquiryValue: string;
  // 문의제목
  subject: string;
  // 첨부파일 토큰
  uploadTokens?: string[];
}

/**
 * 젠데스크 일반문의 등록 API
 */
export const createQnaRegisterGeneral = (params: CreateQnaRegisterGeneralParams): Promise<QnaDetailSchema> => {
  debug.log('createQnaRegisterGeneral', params);

  return baseApiClient.post('/v1/zendesk/requests/general', params);
};

/**
 * 젠데스크 상품문의 등록 Request Parameters
 */
export interface CreateQnaRegisterGoodsParams {
  // 문의내용
  body: string;
  // 상품번호
  goodsId: number;
  // 문의제목
  subject: string;
  // 첨부파일 토큰
  uploadTokens?: string[];
}

/**
 * 젠데스크 상품문의 등록 API
 */
export const createQnaRegisterGoods = (params: CreateQnaRegisterGoodsParams): Promise<QnaDetailSchema> => {
  debug.log('createQnaRegisterGoods', params);

  return baseApiClient.post('/v1/zendesk/requests/goods', params);
};

/**
 * 젠데스크 주문문의 등록 Request Parameters
 */
export interface CreateQnaRegisterOrderParams {
  // 문의내용
  body: string;
  // 문의 유형
  inquiryValue: string;
  // 주문번호
  orderId: number;
  // 주문상품 옵션번호
  orderItemOptionId: number;
  // 문의제목
  subject: string;
  // 첨부파일 토큰
  uploadTokens?: string[];
}

/**
 * 젠데스크 주문문의 등록 API
 */
export const createQnaRegisterOrder = (params: CreateQnaRegisterOrderParams): Promise<QnaDetailSchema> => {
  debug.log('createQnaRegisterOrder', params);

  return baseApiClient.post('/v1/zendesk/requests/order', params);
};

/**
 * 젠데스크 추가 문의 등록 Request Parameters
 */
export interface CreateQnaRegisterAdditionalParams {
  // 문의내용
  body: string;
  // 추가할 대상 문의번호
  requestId: number;
  // 첨부파일 토큰
  uploadTokens?: string[];
}

/**
 * 젠데스크 추가 문의 등록 API
 */
export const createQnaRegisterAdditional = (params: CreateQnaRegisterAdditionalParams): Promise<'ok'> => {
  debug.log('createQnaRegisterAdditional', params);

  const { requestId, ...rest } = params;

  return baseApiClient.post(`/v1/zendesk/requests/${requestId}/comments`, rest);
};

/**
 * 젠데스크 문의 등록시 분류 목록 조회 Request Parameters
 */
interface GetQnaFields {
  fieldType: 'GENERAL_INQUIRY_DROPDOWN' | 'ORDER_INQUIRY_DROPDOWN';
}

/**
 * 젠데스크 문의 등록시 분류 목록 조회 API
 */
export const getQnaFields = ({ fieldType }: GetQnaFields): Promise<QnaFieldsSchema> => {
  debug.log('getQnaFields', fieldType);

  return baseApiClient.get(`/v1/zendesk/ticket-fields/${fieldType}`);
};

/**
 * 젠데스크 주문 문의 등록시 분류에 따른 템플릿 조회 Request Parameters
 */
export interface GetQnaOrderTemplateParams {
  optionId: number;
  type: 'EXCHANGE' | 'RETURN';
}

/**
 * 젠데스크 주문 문의 등록시 분류에 따른 템플릿 조회 API
 */
export const getQnaOrderTemplate = (params: GetQnaOrderTemplateParams): Promise<QnaOrderTemplate> => {
  debug.log('getQnaOrderTemplate', params);

  return baseApiClient.get('/v1/zendesk/requests/order-template', params);
};

/**
 * 젠데스크 문의 등록시 첨부파일 사전 업로드 Request Parameters
 */
interface CreateQnaUploadParams {
  fileName: string;
  file: File;
}

/**
 * 젠데스크 문의 등록시 첨부파일 사전 업로드 API
 */
export const createQnaUpload = ({ fileName, file }: CreateQnaUploadParams): Promise<QnaUploadSchema> => {
  debug.log('createQnaUpload');

  const formData = new FormData();
  formData.append('fileName', fileName);
  formData.append('file', file);

  return baseFormMultipartApi.post('/v1/zendesk/upload', formData);
};

/**
 * 젠데스크 미등록 회원 추가/현정보 갱신
 */
export const updateZendeskUsers = (): Promise<'ok'> => {
  debug.log('updateZendeskUsers');

  return baseApiClient.post('/v1/zendesk/users');
};

/**
 * 유선 상담 상태 갱신 Request Parameters
 */
interface UpdateOutgoingCallStatusParams {
  requestId: number;
  status: OutgoingCallStatus;
}

/**
 * 유선 상담 상태 갱신 API
 */
export const updateOutgoingCallStatus = (params: UpdateOutgoingCallStatusParams): Promise<'ok'> => {
  debug.log('updateOutgoingCallStatus', params);

  const { requestId, ...rest } = params;

  return baseApiClient.put(`/v1/zendesk/requests/${requestId}/outgoing-call-status`, rest);
};
