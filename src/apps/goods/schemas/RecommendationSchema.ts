import { LoadMoreContentSchema } from './CommonSchema';
import { BrandSchema, GoodsSchema } from './GoodsSchema';
import { OptionDefaultSchema } from './OptionSchema';

/** 랜딩 스키마 */
interface LandingSchema {
  scheme: string;
  web?: string;
  referenceId?: number;
}

/** 추천 상품 스키마 */
interface RecommendationGoodsSchema
  extends Pick<GoodsSchema, 'id' | 'name' | 'primaryImage' | 'type' | 'status' | 'kind' | 'benefits' | 'isRunOut'>,
    Pick<OptionDefaultSchema, 'price' | 'consumerPrice' | 'discountRate'> {
  /** 쇼룸 id */
  showRoomId: number;
  /** Goods Code */
  code: string;
  /** 쿠폰 적용 가능 여부 */
  hasCoupon: boolean;
  /** 랜딩 */
  landing: LandingSchema;
  label?: string;
}

/** 추천 브랜드 스키마 */
interface RecommendationBrandSchema extends Omit<BrandSchema, 'showRoom'> {
  defaultShowRoomId?: number;
}

/** 추천 스키마 */
export type RecommendationSchema = LoadMoreContentSchema<
  {
    brand: RecommendationBrandSchema;
    goods: RecommendationGoodsSchema;
  },
  {
    id: number;
    title: string;
  }
>;
