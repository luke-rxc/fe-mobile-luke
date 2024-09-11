import { CheckoutCouponSchema } from './CheckoutCouponSchema';

export interface CheckoutSchema {
  itemCount: number;
  itemList: CheckoutItemSchema[];
  orderer: CheckoutOrdererSchema;
  payment: CheckoutPaymentSchema;
  recipient: CheckoutRecipientSchema;
  usableGoodsCoupon: Record<string, CheckoutCouponSchema[]> | null;
  usableCartCouponList: CheckoutCouponSchema[] | null;
  seatExpiredDate: number | null;
  guideMessages: string[];
}

export interface CheckoutItemSchema {
  provider: CheckoutProviderSchema;
  shippingGroupList: CheckoutShippingGroupSchema[];
  orderPrice: number;
  totalSalesPrice: number;
  totalShippingCost: number;
}

export interface CheckoutProviderSchema {
  id: number;
  name: string;
}

export interface CheckoutShippingGroupSchema {
  shippingCost: number;
  shippingGroupName: string;
  shippingPolicyText: string;
  orderDataList: CheckoutOrderDataSchema[];
  /**
   * 날짜 정보 merging 여부
   */
  isConsecutiveStay: boolean;
  /**
   * 상품 판매가
   */
  totalSalesPrice: number;
  /**
   * 상품 정상가
   */
  totalConsumerPrice: number;
  /**
   * 상품 할인율
   */
  totalDiscountRate: number;
}

export interface CheckoutOrderDataSchema {
  brand: CheckoutBrandSchema;
  goods: CheckoutGoodsSchema;
  quantity: number;
  consumerPriceWithQuantity: number;
  priceWithQuantity: number;
  pcccRequired: boolean;
}

export interface CheckoutBrandSchema {
  id: number;
  name: string;
  primaryImage: CheckoutImageSchema;
  defaultShowRoomId: number | null;
}

export interface CheckoutGoodsSchema {
  id: number;
  name: string;
  primaryImage: CheckoutImageSchema;
  consumerPrice: number;
  price: number;
  discountRate: number;
  option: CheckoutOptionSchema;
  packageOption: CheckoutOptionSchema | null;
  code: string;
  showRoomId: number | null;
  kind: 'REAL' | 'TICKET_NORMAL' | 'TICKET_AGENT';
}

export interface CheckoutOptionSchema {
  id: number;
  itemList: CheckoutOptionItemSchema[];
  bookingDate: number;
  optionPositionBookingDate?: number;
}

export interface CheckoutOptionItemSchema {
  title: string;
  value: string;
}

export interface CheckoutImageSchema {
  blurHash: string | null;
  height: number;
  id: number;
  path: string;
  width: number;
}

export interface CheckoutOrdererSchema {
  isIdentify: boolean;
  email: string;
  name: string | null;
  phone: string | null;
}

export interface CheckoutPaymentSchema {
  availablePaymentTypes: string[];
  orderPrice: number;
  totalSalesPrice: number;
  totalShippingCost: number;
  pointBalance: number;
  usablePoint: number;
  pointWeight: number;
  savedPaymentType: string | null;
  isShowInstallmentDropdown: boolean;
  paymentBenefitList: {
    paymentType: string;
    benefitList: { title: string | null; content: string }[];
  }[];
}

export interface CheckoutRecipientSchema {
  isPcccRequired: boolean;
  name: string | null;
  phone: string | null;
  postCode: string | null;
  address: string | null;
  addressDetail: string | null;
  isAddressRequired: boolean;
  isShowRequestMessageDropdown: boolean;
}

export interface CheckoutOrderSchema {
  orderId: number;
  shopId: string | null;
  paymentGatewayParameter: CheckoutPaymentGateWaySchema | null;
}

export interface CheckoutPaymentGateWaySchema {
  pgType: string;
  pg: string;
  pgForLog: string | null;
  payMethod: string;
  merchantId: string;
  name: string;
  amount: number;
  buyerEmail: string;
  buyerName: string;
  buyerTel: string;
  naverPopupMode?: boolean;
  naverProducts?: NaverProduct[];
  isEasyPay?: boolean;
  cardCompany?: string;
  useAppCardOnly: boolean;
}

export interface NaverProduct {
  categoryType: string;
  categoryId: string;
  name: string;
  uid: string;
  count: number;
}
