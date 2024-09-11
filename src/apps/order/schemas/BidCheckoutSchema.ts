import { CheckoutCouponSchema } from './CheckoutCouponSchema';

export interface BidCheckoutSchema {
  itemCount: number;
  itemList: BidCheckoutItemSchema[];
  orderer: BidCheckoutOrdererSchema;
  payment: BidCheckoutPaymentSchema;
  recipient: BidCheckoutRecipientSchema;
  usableGoodsCoupon: Record<string, CheckoutCouponSchema[]> | null;
  usableCartCouponList: CheckoutCouponSchema[] | null;
  seatExpiredDate: number | null;
  guideMessages: string[];
}

export interface BidCheckoutItemSchema {
  provider: BidCheckoutProviderSchema;
  shippingGroupList: BidCheckoutShippingGroupSchema[];
  orderPrice: number;
  totalSalesPrice: number;
  totalShippingCost: number;
}

export interface BidCheckoutProviderSchema {
  id: number;
  name: string;
}

export interface BidCheckoutShippingGroupSchema {
  shippingCost: number;
  shippingGroupName: string;
  shippingPolicyText: string;
  orderDataList: BidCheckoutOrderDataSchema[];
  // 날짜 정보 merging 여부
  isConsecutiveStay: boolean;
  // 상품 판매가
  totalSalesPrice: number;
  // 상품 정상가
  totalConsumerPrice: number;
  // 상품 할인율
  totalDiscountRate: number;
}

export interface BidCheckoutOrderDataSchema {
  brand: BidCheckoutBrandSchema | null;
  goods: BidCheckoutGoodsSchema;
  quantity: number;
  consumerPriceWithQuantity: number;
  priceWithQuantity: number;
  pcccRequired: boolean;
}

export interface BidCheckoutBrandSchema {
  id: number;
  name: string;
  primaryImage: BidCheckoutImageSchema;
  defaultShowRoomId: number | null;
}

export interface BidCheckoutGoodsSchema {
  id: number;
  name: string;
  primaryImage: BidCheckoutImageSchema;
  consumerPrice: number;
  price: number;
  discountRate: number;
  option: BidCheckoutOptionSchema;
  packageOption: BidCheckoutOptionSchema | null;
  code: string;
  showRoomId: number | null;
  label: string | null;
  isPrizmOnly: boolean;
  kind: 'REAL' | 'TICKET_NORMAL' | 'TICKET_AGENT';
}

export interface BidCheckoutOptionSchema {
  id: number;
  bookingDate: number;
  itemList: BidCheckoutOptionItemSchema[];
  optionPositionBookingDate?: number;
}

export interface BidCheckoutOptionItemSchema {
  title: string;
  value: string;
}

export interface BidCheckoutImageSchema {
  blurHash: string | null;
  height: number;
  id: number;
  path: string;
  width: number;
  fileType: string;
  extension: string;
}

export interface BidCheckoutOrdererSchema {
  isIdentify: boolean;
  email: string;
  name: string | null;
  phone: string | null;
}

export interface BidCheckoutPaymentSchema {
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

export interface BidCheckoutRecipientSchema {
  isPcccRequired: boolean;
  name: string | null;
  phone: string | null;
  postCode: string | null;
  address: string | null;
  addressDetail: string | null;
  isAddressRequired: boolean;
  isShowRequestMessageDropdown: boolean;
}

export interface BidCheckoutOrderSchema {
  orderId: number;
  shopId: string | null;
  paymentGatewayParameter: BidCheckoutPaymentGateWaySchema | null;
}

export interface BidCheckoutPaymentGateWaySchema {
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
  cardCompany?: string;
  useAppCardOnly: boolean;
}
