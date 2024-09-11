import { GoodsSchema, BrandSchema } from './GoodsSchema';
import { OptionDefaultSchema } from './OptionSchema';
import { LoadMoreContentSchema } from './CommonSchema';

export interface DealGoodsSchema
  extends Pick<
      GoodsSchema,
      'id' | 'name' | 'primaryImage' | 'salesStartDate' | 'salesEndDate' | 'displayStartDate' | 'benefits' | 'isRunOut'
    >,
    Pick<OptionDefaultSchema, 'price' | 'consumerPrice' | 'discountRate'> {
  /** 상품 타입 */
  goodsType?: GoodsSchema['type'];
  /** 상품 상태 */
  goodsStatus?: GoodsSchema['status'];
  /** @todo 이 값의 사용유무 */
  label?: string;
  /** Goods Code */
  code: string;
  /** 쿠폰 적용 가능 여부 */
  hasCoupon: boolean;
}

export interface DealBrandSchema extends BrandSchema {
  defaultShowRoomId?: number;
}

export type DealsSchema = LoadMoreContentSchema<
  { brand: DealBrandSchema; goods: DealGoodsSchema },
  { sort: 'RECOMMENDATION' }
>;
