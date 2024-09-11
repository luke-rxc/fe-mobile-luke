import values from 'lodash/values';
import { getImageLink } from '@utils/link';
import { AuthenticationFormFields } from '@features/authentication/types';
import { toKRW } from '@utils/toKRW';
import { PGType, SupportedPayments } from '@constants/order';
import { add } from 'date-fns';
import cloneDeep from 'lodash/cloneDeep';
import {
  BidCheckoutGoodsSchema,
  BidCheckoutImageSchema,
  BidCheckoutItemSchema,
  BidCheckoutOptionSchema,
  BidCheckoutOrderDataSchema,
  BidCheckoutOrdererSchema,
  BidCheckoutPaymentSchema,
  BidCheckoutRecipientSchema,
  BidCheckoutSchema,
  BidCheckoutShippingGroupSchema,
} from '../schemas';
import { SelectedCoupon } from '../types';
import { PaymentType } from './CheckoutModel';
import { getDateRangeText } from '../utils';

export interface BidCheckoutModel {
  orderCount: number;
  orderer: BidCheckoutOrdererInfoModel;
  recipient: BidCheckoutRecipientInfoModel;
  recipientMessage: string;
  orderInfo: BidCheckoutGoodsInfoModel;
  isPccRequired: boolean;
  summaryInfo: BidCheckoutSummaryModel;
  paymentInfo: BidCheckoutPaymentModel;
  seatExpiredDate: BidCheckoutSchema['seatExpiredDate'];
  guideMessages: string[];
}

export type BidCheckoutOrdererInfoModel = BidCheckoutOrdererSchema;

export interface BidCheckoutGoodsInfoModel {
  goodsInfos: BidCheckoutGoodsGroupModel[];
}

type BidCheckoutGoodsPictureModel = BidCheckoutImageSchema;
export interface BidCheckoutGoodsGroupModel {
  goodsId: number;
  goodsList: BidCheckoutGoodsModel[];
}
export interface BidCheckoutGoodsModel extends BidCheckoutGoodsSchema {
  brandId: number | null;
  brandName: string | null;
  goodsPriceText: string;
  salesPriceText: string;
  options: string[];
  quantity: number;
}

export type BidCheckoutRecipientInfoModel = Omit<BidCheckoutRecipientSchema, 'isPcccRequired' | 'addressName'>;

export interface BidCheckoutPaymentModel {
  selectedType: PGType | null;
  paymentTypeList: PaymentType[];
  availablePaymentTypes: string[];
  isAvailablePoint: boolean;
  isShowInstallmentDropdown: boolean;
}

export interface BidCheckoutSummaryModel
  extends Omit<BidCheckoutPaymentSchema, 'availablePaymentTypes' | 'isShowInstallmentDropdown'> {
  totalUsedPoint: number;
  totalUsedPointText: string;
  orderPriceText: string;
  totalSalesPriceText: string;
  totalShippingCostText: string;
  totalGoodsCouponPrice: number;
  totalGoodsCouponPriceText: string;
  totalCartCouponPrice: number;
  totalCartCouponPriceText: string;
}

export interface BidCheckoutFormFields extends Pick<AuthenticationFormFields, 'name' | 'phone'> {
  message: string;
  etcMessage: string;
  useGoodsCoupons: SelectedCoupon[];
  useCartCoupon: SelectedCoupon | null;
  usePoint: string;
  pcc: string;
  isRequiredPcc: boolean;
  isAgree: boolean;
  payType: string;
  prizmPayId: number | null;
  isSavePayment: boolean;
  recipientName: string;
  recipientPhone: string;
  recipientPostCode: string;
  recipientAddress: string;
  recipientAddressDetail: string;
  orderPrice: number;
  cardInstallmentPlan: number;
}

export function toBidCheckoutModel(schema: BidCheckoutSchema): BidCheckoutModel {
  const orderInfo = toBidCheckoutGoodsInfoModel(schema.itemList);
  const orderCount = schema.itemCount !== orderInfo.goodsInfos.length ? orderInfo.goodsInfos.length : schema.itemCount;

  return {
    orderCount,
    orderer: toBidCheckoutOrdererInfoModel(schema.orderer),
    recipient: toBidCheckoutRecipientInfoModel(schema.recipient),
    recipientMessage: '',
    isPccRequired: schema.recipient.isPcccRequired,
    orderInfo,
    summaryInfo: {
      ...toBidCheckoutSummaryModel(schema.payment),
      ...(!schema.recipient.isAddressRequired && { totalShippingCostText: '' }),
    },
    paymentInfo: toBidCheckoutPaymentModel(schema.payment),
    seatExpiredDate: schema.seatExpiredDate,
    guideMessages: schema.guideMessages,
  };
}

export function toBidCheckoutGoodsModel(schema: BidCheckoutOrderDataSchema): BidCheckoutGoodsModel {
  const { brand, goods, consumerPriceWithQuantity, priceWithQuantity, ...others } = schema;

  return {
    ...others,
    ...goods,
    consumerPrice: priceWithQuantity,
    price: consumerPriceWithQuantity,
    brandId: brand?.id ?? null,
    brandName: brand?.name ?? null,
    goodsPriceText: goods.consumerPrice.toLocaleString(),
    salesPriceText: goods.price.toLocaleString(),
    options: getGoodsOptionValues(goods.option),
    quantity: schema.quantity,
    primaryImage: toBidCheckoutGoodsImageModel(schema.goods.primaryImage),
  };
}

export function toBidCheckoutDateShippingGroup(schema: BidCheckoutShippingGroupSchema): BidCheckoutShippingGroupSchema {
  if (schema.isConsecutiveStay) {
    const { totalSalesPrice, totalConsumerPrice, totalDiscountRate, orderDataList } = schema;
    const [first] = orderDataList;
    const last = orderDataList.slice(-1)[0];
    const bookingStartDate = first.goods.option.bookingDate;
    const bookingEndDate = add(last.goods.option.bookingDate, { days: 1 }).getTime();
    const copy = cloneDeep(first);
    const bookingDateIndex = Math.max((first.goods.option.optionPositionBookingDate ?? 1) - 1, 0);
    const date = copy.goods.option.itemList[bookingDateIndex];
    copy.consumerPriceWithQuantity = totalConsumerPrice;
    copy.priceWithQuantity = totalSalesPrice;
    copy.goods.discountRate = totalDiscountRate;
    date.value = getDateRangeText(bookingStartDate, bookingEndDate, orderDataList.length);

    return {
      ...schema,
      orderDataList: [copy],
    };
  }

  return schema;
}

export function toBidCheckoutGoodsInfoModel(schema: BidCheckoutItemSchema[]): BidCheckoutGoodsInfoModel {
  const toShipping = schema.map((provider) => provider.shippingGroupList.map(toBidCheckoutDateShippingGroup)).flat();
  const toGoods = toShipping
    .map((shipping) => shipping.orderDataList)
    .flat()
    .map(toBidCheckoutGoodsModel);

  const goodsInfos = values(groupByGoodsId(toGoods));

  return {
    goodsInfos,
  };
}

function groupByGoodsId(goodsList: BidCheckoutGoodsModel[]): Record<number, BidCheckoutGoodsGroupModel> {
  return goodsList.reduce<Record<number, BidCheckoutGoodsGroupModel>>((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = {
        goodsId: item.id,
        goodsList: [],
      };
    }

    acc[item.id].goodsList.push(item);
    return acc;
  }, {});
}

export function toBidCheckoutRecipientInfoModel(schema: BidCheckoutRecipientSchema): BidCheckoutRecipientInfoModel {
  const { address, addressDetail, name, phone, postCode, isAddressRequired, isShowRequestMessageDropdown } = schema;

  return {
    name: name ?? '',
    phone: phone ?? '',
    postCode: postCode ?? '',
    address: address ?? '',
    addressDetail: addressDetail ?? '',
    isAddressRequired,
    isShowRequestMessageDropdown,
  };
}

function toBidCheckoutGoodsImageModel(schema: BidCheckoutImageSchema): BidCheckoutGoodsPictureModel {
  return { ...schema, path: getImageLink(schema.path, 512) };
}

export function toBidCheckoutOrdererInfoModel(schema: BidCheckoutOrdererSchema): BidCheckoutOrdererInfoModel {
  return { ...schema };
}

export function toBidCheckoutSummaryModel(schema: BidCheckoutPaymentSchema): BidCheckoutSummaryModel {
  return {
    ...schema,
    totalUsedPoint: 0,
    totalUsedPointText: '',
    orderPriceText: toKRW(schema.orderPrice),
    totalSalesPriceText: toKRW(schema.totalSalesPrice),
    totalShippingCostText: toKRW(schema.totalShippingCost),
    totalGoodsCouponPrice: 0,
    totalGoodsCouponPriceText: '',
    totalCartCouponPrice: 0,
    totalCartCouponPriceText: '',
  };
}

export function toBidCheckoutPaymentModel(schema: BidCheckoutPaymentSchema): BidCheckoutPaymentModel {
  const { savedPaymentType, availablePaymentTypes, paymentBenefitList } = schema;
  const defaultPaymentType = availablePaymentTypes[0] as PGType;
  const selectedType = getSelectedType(savedPaymentType, defaultPaymentType, availablePaymentTypes);
  const paymentTypeList = availablePaymentTypes
    .map(getPaymentType)
    .filter((item) => item.pgType !== PGType.UNKNOWN)
    .map((item) => {
      const benefit = getBenefitByPgType(item.pgType, paymentBenefitList);
      return {
        ...item,
        ...benefit,
      };
    });

  return {
    selectedType,
    paymentTypeList,
    isAvailablePoint: false,
    availablePaymentTypes,
    isShowInstallmentDropdown: schema.isShowInstallmentDropdown,
  };
}

function getSelectedType(type: string | null, defaultPaymentType: PGType, availablePaymentTypes: string[]) {
  if (!type || !availablePaymentTypes.includes(type)) {
    return defaultPaymentType;
  }

  return SupportedPayments[type]?.pgType ?? defaultPaymentType;
}

function getBenefitByPgType(pgType: PGType, benefits: BidCheckoutPaymentSchema['paymentBenefitList']) {
  const benefitList = benefits
    .find((benefit) => benefit.paymentType === pgType)
    ?.benefitList.map((benefit) => ({ ...benefit, title: benefit.title ?? '' }));

  return (
    benefitList && {
      label: '혜택',
      benefitList,
    }
  );
}

function getPaymentType(type: string) {
  return SupportedPayments[type] ?? SupportedPayments[PGType.UNKNOWN];
}

function getGoodsOptionValues(schema: BidCheckoutOptionSchema) {
  return schema.itemList.map((item) => item.value);
}
