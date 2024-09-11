import { baseApiClient } from '@utils/api';
import { GoodsSortingType } from '@constants/goods';
import {
  GoodsSchema,
  InformationListSchema,
  DealsSchema,
  FileListSchema,
  CouponSchema,
  WishSchema,
  OrderSaveSchema,
  ContentSchema,
  ReviewShortcutListSchema,
  ReviewSchema,
  CouponDownloadListSchema,
  CouponDownloadSchema,
  RecommendationSchema,
  DetailInfoSchema,
  DetailInfoOndaSchema,
} from '../schemas';
import { FeedItemLimit } from '../constants';

export interface GoodsParam {
  goodsId: number;
  showRoomId?: number;
  /** 라이브 페이지인지 여부 */
  isInLivePage: boolean;
}

export interface GoodsInformationParam {
  goodsId: number;
}

export interface GoodsDetailParam {
  goodsId: number;
}

export interface GoodsDetailInfoParam {
  goodsId: number;
}

export interface DealsParam {
  goodsId: number;
  showroomId: number;
  nextParameter?: string;
  size?: number;
  sort?: GoodsSortingType;
}

export interface ContentParam {
  showroomId: number;
  nextParameter: string;
  size?: number;
}

export interface CouponParam {
  goodsId: number;
  showRoomId: number | null;
}

export interface CouponDownloadParam {
  couponId: number;
}

export interface WishGetParam {
  goodsId: number;
}

export interface WishPostParam {
  goodsId: number;
  showRoomId?: number | null;
}

export interface SaveActionParam {
  itemList: {
    optionIdList: number[];
    quantity: number;
  }[];
  showRoomId?: number | null;
}

export interface SaveActionPostParam {
  saveParam: SaveActionParam;
  goodsId: number;
}

export interface SeatSaveActionParam extends Omit<SaveActionParam, 'itemList'> {
  itemList: {
    secondaryId: number;
    optionId: number;
    quantity: number;
  }[];
}

export interface SeatSaveActionPostParam extends Omit<SaveActionPostParam, 'saveParam'> {
  saveParam: SeatSaveActionParam;
}

export interface HistoryPostParam {
  goodsId: number;
  showRoomId?: number | null;
}

export interface NotificationGetParam {
  goodsId: number;
}

export interface ReviewShortcutGetParam {
  goodsId: number;
}

export interface ReviewListGetParam {
  goodsId: number;
  size?: number;
}

export interface RecommendationGetParam {
  goodsId: number;
  type: string;
  size?: number;
}

// 상품 리스트 불러오기
export const getGoods = ({ goodsId, showRoomId = 0, isInLivePage }: GoodsParam): Promise<GoodsSchema> => {
  const apiBaseUrl = `/v1/goods/${goodsId}/showroom/${showRoomId}`;
  const apiUrl = isInLivePage ? `${apiBaseUrl}/live` : apiBaseUrl;
  return baseApiClient.get<GoodsSchema>(apiUrl);
};

// 상품 리스트 내 상품 고시 정보 불러오기
export const getGoodsInformation = ({ goodsId }: GoodsInformationParam): Promise<InformationListSchema> => {
  return baseApiClient.get<InformationListSchema>(`/v1/goods/${goodsId}/information`);
};

/** 상품 리스트 내 상품상세 이미지 정보 불러오기 */
export const getGoodsDetail = ({ goodsId }: GoodsDetailParam): Promise<FileListSchema[]> => {
  return baseApiClient.get<FileListSchema[]>(`/v1/goods/${goodsId}/component`);
};

/** 상품 리스트 내 상품 이용 안내 불러오기 */
export const getGoodsDetailInfo = ({ goodsId }: GoodsDetailInfoParam): Promise<DetailInfoSchema[]> => {
  return baseApiClient.get(`v1/goods/${goodsId}/detail-information`);
};

/** 상품 리스트 내 상품 이용 안내 불러오기 (ONDA 상품) */
export const getGoodsDetailInfoOnda = ({ goodsId }: GoodsDetailInfoParam): Promise<DetailInfoOndaSchema> => {
  return baseApiClient.get(`v1/goods/${goodsId}/detail-information-onda`);
};

// 쇼룸에 연결된 딜 정보 API
export const getDeals = ({
  goodsId,
  showroomId,
  nextParameter = '',
  size = 20,
  sort = GoodsSortingType.RECOMMENDATION,
}: DealsParam) => {
  return baseApiClient.get<DealsSchema>(
    `/v2/showroom/${showroomId}/deals/${goodsId}?size=${size}&sort=${sort}${nextParameter ? `&${nextParameter}` : ''}`,
  );
};

// 상품에 연결된 컨텐츠 정보 API
export const getContentList = ({ showroomId, nextParameter = '', size = 20 }: ContentParam) => {
  return baseApiClient.get<ContentSchema>(`/v1/showroom/${showroomId}/story?size=${size}&${nextParameter}`);
};

// 쿠폰 리스트 불러오기
export const getCouponList = ({ goodsId, showRoomId }: CouponParam): Promise<CouponSchema[]> => {
  const params = { showRoomId };
  return baseApiClient.get<CouponSchema[]>(`/v1/coupon/goods/${goodsId}`, params);
};

export const postCouponDownload = ({ couponId }: CouponDownloadParam): Promise<CouponDownloadSchema> => {
  return baseApiClient.post<CouponDownloadSchema>(`/v1/coupon/${couponId}`);
};

// 다건 쿠폰 다운로드
export const postCouponDownloadList = (couponIds: number[]): Promise<CouponDownloadListSchema> => {
  const params = { couponIds };
  return baseApiClient.post<CouponDownloadListSchema>(`/v2/coupon`, params);
};

// 상품 위시리스트 저장 여부 조회
export const getWishList = ({ goodsId }: WishGetParam): Promise<WishSchema> => {
  return baseApiClient.get<WishSchema>(`/v1/wish-item/goods/${goodsId}`);
};

// 상품 위시리스트 저장
export const postWishList = ({ goodsId, showRoomId }: WishPostParam): Promise<unknown> => {
  const params = { showRoomId };
  return baseApiClient.post<unknown>(`/v1/wish-item/goods/${goodsId}`, params);
};

// 상품 위시리스트 삭제
export const deleteWishList = ({ goodsId }: WishPostParam): Promise<unknown> => {
  return baseApiClient.delete<unknown>(`/v1/wish-item/goods/${goodsId}`);
};

// 장바구니
export const postCart = ({ saveParam, goodsId }: SaveActionPostParam): Promise<'ok'> => {
  const params = { ...saveParam };
  return baseApiClient.post<'ok'>(`/v1/cart/${goodsId}`, params);
};

// 주문하기
export const postOrder = ({ saveParam, goodsId }: SaveActionPostParam): Promise<OrderSaveSchema> => {
  const params = { ...saveParam };
  return baseApiClient.post<OrderSaveSchema>(`/v1/order/checkout/goods/${goodsId}`, params);
};

// 좌석 지정 주문하기
export const postSeatOrder = ({ saveParam, goodsId }: SeatSaveActionPostParam): Promise<OrderSaveSchema> => {
  const params = { ...saveParam };
  return baseApiClient.post<OrderSaveSchema>(`/v1/order/checkout/goods/${goodsId}/seat`, params);
};

// 최근 본 상품 저장
export const postHistory = ({ goodsId, showRoomId }: HistoryPostParam): Promise<unknown> => {
  const params = { goodsId, showRoomId };
  return baseApiClient.post<unknown>('/v1/goods/history', params);
};

// 판매상품 알림 조회
export const getNotification = ({ goodsId }: NotificationGetParam): Promise<boolean> => {
  return baseApiClient.get<boolean>(`v1/notification/sale-goods/${goodsId}`);
};

// 판매상품 알림 등록
export const postNotification = ({ goodsId }: NotificationGetParam): Promise<unknown> => {
  return baseApiClient.post<unknown>(`v1/notification/sale-goods/${goodsId}`);
};

// 판매상품 알림 삭제
export const deleteNotification = ({ goodsId }: NotificationGetParam): Promise<unknown> => {
  return baseApiClient.delete<unknown>(`v1/notification/sale-goods/${goodsId}`);
};

// 리뷰 숏컷 리스트 조회
export const getReviewShortcut = ({ goodsId }: ReviewShortcutGetParam): Promise<ReviewShortcutListSchema> => {
  return baseApiClient.get<ReviewShortcutListSchema>(`/v1/goods/${goodsId}/review`);
};

// 리뷰 리스트 조회
export const getReviewList = ({ goodsId, size = FeedItemLimit }: ReviewListGetParam): Promise<ReviewSchema> => {
  return baseApiClient.get<ReviewSchema>(`v1/review/goods/${goodsId}?size=${size}`);
};

// 연관 상품 추천 리스트 조회
export const getRecommendationList = ({
  goodsId,
  type,
  size = FeedItemLimit,
}: RecommendationGetParam): Promise<RecommendationSchema> => {
  return baseApiClient.get<RecommendationSchema>(`v1/goods/${goodsId}/recommendation/goods?type=${type}&size=${size}`);
};
