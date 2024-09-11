import { CheckoutGoodsSchema } from './CheckoutSchema';

export interface OrderSchema {
  orderId: number;
  orderStatus: OrderStatusSchema;
  orderer: OrderOrdererInfoSchema;
  payment: OrderPaymentInfoSchema;
  recipient: OrderRecipientInfoSchema;
  checkoutId: number | null;
  itemOptionList: ItemOptionSchema[] | null;
  goodsType: string;
  isFinished: boolean;
  failReason: string | null;
  failure?: {
    code: string;
    message: string;
  };
  isRequiredInputForm: boolean;
  inputFormInfo: {
    expiryDate: number;
    sectionType: 'AIRLINE_TICKET';
  } | null;
  isConsecutiveStay: boolean;
  title: string;
  description: string;
  /* cspell: disable-next-line */
  navigations: string[];
}

export interface ItemOptionSchema {
  id: number;
  itemId: number;
  brand: {
    id: number;
    name: string;
    primaryImage: {
      blurHash: string | null;
      height: number;
      id: number;
      path: string;
      width: number;
    };
    defaultShowRoomId: number | null;
  } | null;
  ea: number;
  goods: ItemOptionGoodsSchema;
  priceWithEa: number;
  statusInfo: OrderStatusSchema;
  showRoom: {
    id: number;
    name: string;
  } | null;
  usedCoupon: {
    couponSale: number;
    discountRate: number;
    id: number;
    name: string;
  } | null;
}

type OrderGoodsSchema = CheckoutGoodsSchema & { kind: string };

export interface ItemOptionGoodsSchema extends OrderGoodsSchema {
  categoryIdList: number[];
  categoryNameList: string[];
  type: string;
  shippingMethod: string;
  label: string | null;
}

export interface OrderStatusSchema {
  // step: OrderStep;
  step: string;
  stepName: string;
}

export interface OrderOrdererInfoSchema {
  email: string;
  name: string;
  phone: string;
}

export interface OrderPaymentInfoSchema {
  amount: number;
  paymentType: PaymentType;
  paymentDate: number;
  totalSalesPrice: number;
  totalShippingCost: number;
  usedCartCouponSale: number;
  usedGoodsCouponSale: number;
  usedPoint: number;
  pg: string;
  pgForLog: string | null;
  usedCartCoupon: {
    couponSale: number;
    discountRate: number;
    id: number;
    name: string;
  } | null;
}

export interface OrderRecipientInfoSchema {
  deliveryRequestMessage: string;
  name: string;
  phone: string;
  postCode: string;
  address: string;
  addressDetail: string;
  isAddressRequired: boolean;
}

interface PaymentType {
  name: string;
  type: string;
}

export const ORDER_STEP = {
  LOADING: '0',
  PAY_COMPLETE: '20',
  PAY_FAIL: '99',
} as const;
export type OrderStep = typeof ORDER_STEP[keyof typeof ORDER_STEP];
