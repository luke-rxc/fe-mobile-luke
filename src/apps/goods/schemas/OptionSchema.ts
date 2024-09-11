import { MultiChoicePolicyType } from '../constants';

// 기본 옵션
export interface OptionDefaultSchema {
  /** 판매가 */
  consumerPrice: number;
  /** 정가 */
  price: number;
  purchasableStock: number;
  /** 할인율 */
  discountRate: number;
  /** id (사용하지 않음) */
  id?: number;
}

export interface OptionInfoSchema extends OptionDefaultSchema {
  id: number;
  isDefaultOption: boolean;
  isRunOut: boolean;
  secondaryId?: number;
  selectedValues?: string[];
}

export interface OptionItemSchema {
  value: string;
  isRunOut: boolean;
  options: OptionInfoSchema[] | null;
  children?: OptionItemSchema[] | null;
}

interface OptionTotalStockSchema {
  // 옵션 재고 초기 값
  initialEa: number;
  // 구매 가능(남은 수량)한 재고 수량
  purchasableEa: number;
  // 수량제한 유무
  isInfinity: boolean;
}

export interface OptionSchema {
  titleList: string[];
  defaultOption: OptionDefaultSchema;
  itemList: OptionItemSchema[];
  /**
   * @description
   * 프리오더 총합 (재고/구매가능수량) , 무제한 여부 응답 포멧
   * - 재고 표현안함(무제한) 기준 = 상품내 옵션 초기재고의 총합이 10만건 이상일경우
   */
  totalStock: OptionTotalStockSchema;
}

export type OptionComponentsSchema = 'DEFAULT' | 'CALENDAR_DAY' | 'CALENDAR_DAY_TIME' | 'SEAT' | 'SEAT_OPTION';

export interface OptionMetadataSchema {
  // 상품 옵션 타입
  type: 'DEFAULT' | 'CALENDAR' | 'SEAT';
  // 모든 옵션 가격이 같은지 여부 (false 일 경우, 가격 노출)
  isAllPriceSame: boolean;
  // 옵션별 UI 타입
  components: OptionComponentsSchema[];
  // 유저 최대 구매수량
  userMaxPurchaseEa: number;
  // 옵션 UI 제어 정책
  multiChoicePolicy: MultiChoicePolicyType;
  // 옵션 모달 가이드 문구
  guideMessages?: string[];
}

// 주문 저장 Response
export interface OrderSaveSchema {
  orderCheckoutId: number;
}

export interface PriceListOptionSchema
  extends Pick<
    OptionInfoSchema,
    'id' | 'consumerPrice' | 'price' | 'purchasableStock' | 'discountRate' | 'selectedValues' | 'isRunOut'
  > {
  bookingDate: number;
  values: string[];
}

interface PriceListTabSchema {
  name: string;
  options: PriceListOptionSchema[];
}

export interface PriceListSchema {
  goodsId: number;
  isSingleOption: boolean;
  tabs: PriceListTabSchema[];
}
