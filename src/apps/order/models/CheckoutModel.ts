import { getImageLink } from '@utils/link';
import { AuthenticationFormFields } from '@features/authentication/types';
import { toKRW } from '@utils/toKRW';
import { PGType, SupportedPayments } from '@constants/order';
import cloneDeep from 'lodash/cloneDeep';
import { add } from 'date-fns';
import { CheckoutCouponModel, toCheckoutCouponModel } from './CheckoutCouponModel';
import {
  CheckoutGoodsSchema,
  CheckoutImageSchema,
  CheckoutItemSchema,
  CheckoutOptionSchema,
  CheckoutOrderDataSchema,
  CheckoutOrdererSchema,
  CheckoutPaymentSchema,
  CheckoutRecipientSchema,
  CheckoutSchema,
  CheckoutShippingGroupSchema,
} from '../schemas';
import { SelectedCoupon } from '../types';
import { PAYMENT_TYPE } from '../constants';
import { getDateRangeText, uniq } from '../utils';

export interface CheckoutModel {
  orderCount: number;
  orderer: CheckoutOrdererInfoModel;
  recipient: CheckoutRecipientInfoModel;
  recipientMessage: string;
  orderInfo: CheckoutGoodsInfoModel;
  isPccRequired: boolean;
  summaryInfo: CheckoutSummaryModel;
  paymentInfo: CheckoutPaymentModel;
  cartCouponList: CheckoutCouponModel[];
  seatExpiredDate: CheckoutSchema['seatExpiredDate'];
  guideMessages: string[];
  /**
   * 날짜 지정 대응으로 인해 model data를 강제로 수정하기 때문에
   * 기존 로깅 로직을 동일하게 적용하기 어려워
   * 로깅시 해당 필드를 사용하도록 하기위함
   *
   * 추후 데이터를 서버 응답으로 대체가 가능한 시점에 제거필요
   */
  loggingData: {
    orderCount: number;
  };
}

export type CheckoutOrdererInfoModel = CheckoutOrdererSchema;

export interface CheckoutGoodsInfoModel {
  goodsInfos: CheckoutGoodsGroupModel[];
}
export interface CheckoutGoodsGroupModel {
  goodsId: number;
  goodsCode: string;
  goodsList: CheckoutGoodsModel[];
  couponList: CheckoutCouponModel[];
}
type CheckoutGoodsPictureModel = CheckoutImageSchema;
export interface CheckoutGoodsModel extends CheckoutGoodsSchema {
  brandId: number | null;
  brandName: string | null;
  goodsPriceText: string;
  salesPriceText: string;
  options: string[];
  quantity: number;
}

export type CheckoutRecipientInfoModel = Omit<CheckoutRecipientSchema, 'isPcccRequired'>;

export type PaymentType = {
  pgType: PGType;
  title: string;
  label?: string;
  benefitList?: {
    title: string;
    content: string;
  }[];
};

export interface CheckoutPaymentModel {
  selectedType: PGType;
  paymentTypeList: PaymentType[];
  availablePaymentTypes: string[];
  isAvailablePoint: boolean;
  isShowInstallmentDropdown: boolean;
}

export interface CheckoutSummaryModel
  extends Omit<CheckoutPaymentSchema, 'availablePaymentTypes' | 'isShowInstallmentDropdown'> {
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

export interface FormFields extends Pick<AuthenticationFormFields, 'name' | 'phone'> {
  message: string;
  etcMessage: string;
  useGoodsCoupons: SelectedCoupon[];
  useCartCoupon: SelectedCoupon | null;
  usePoint: string;
  pcc: string;
  isRequiredPcc: boolean;
  isAgree: boolean;
  prizmPayId: number | null;
  payType: string;
  isSavePayment: boolean;
  recipientName: string;
  recipientPhone: string;
  recipientPostCode: string;
  recipientAddress: string;
  recipientAddressDetail: string;
  orderPrice: number;
  cardInstallmentPlan: number;
}

export function toCheckoutModel(schema: CheckoutSchema): CheckoutModel {
  const orderInfo = toCheckoutGoodsInfoModel(schema.itemList, schema.usableGoodsCoupon);
  const orderCount = schema.itemCount !== orderInfo.goodsInfos.length ? orderInfo.goodsInfos.length : schema.itemCount;

  return {
    orderCount,
    orderer: toCheckoutOrdererInfoModel(schema.orderer),
    recipient: toCheckoutRecipientInfoModel(schema.recipient),
    recipientMessage: '',
    isPccRequired: schema.recipient.isPcccRequired,
    orderInfo,
    summaryInfo: {
      ...toCheckoutSummaryModel(schema.payment),
      ...(!schema.recipient.isAddressRequired && { totalShippingCostText: '' }),
    },
    paymentInfo: toCheckoutPaymentModel(schema.payment),
    cartCouponList: schema.usableCartCouponList?.map(toCheckoutCouponModel) ?? [],
    seatExpiredDate: schema.seatExpiredDate,
    guideMessages: schema.guideMessages,
    loggingData: {
      orderCount: schema.itemCount,
    },
  };
}

export function toCheckoutGoodsModel(schema: CheckoutOrderDataSchema): CheckoutGoodsModel {
  const { brand, goods, consumerPriceWithQuantity, priceWithQuantity, ...others } = schema;

  return {
    ...others,
    ...goods,
    consumerPrice: consumerPriceWithQuantity,
    price: priceWithQuantity,
    brandId: brand?.id ?? null,
    brandName: brand?.name ?? null,
    goodsPriceText: goods.consumerPrice.toLocaleString(),
    salesPriceText: goods.price.toLocaleString(),
    options: getGoodsOptionValues(goods.option),
    quantity: schema.quantity,
    primaryImage: toCheckoutGoodsImageModel(schema.goods.primaryImage),
  };
}

export function toCheckoutDateShippingGroup(schema: CheckoutShippingGroupSchema): CheckoutShippingGroupSchema {
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

export function toCheckoutGoodsInfoModel(
  schema: CheckoutItemSchema[],
  usableGoodsCouponListSchema: CheckoutSchema['usableGoodsCoupon'],
): CheckoutGoodsInfoModel {
  const toShipping = schema.map((provider) => provider.shippingGroupList.map(toCheckoutDateShippingGroup)).flat();
  const orderDataList = toShipping.map((shipping) => shipping.orderDataList).flat();
  const toGoods = orderDataList.map(toCheckoutGoodsModel);
  const seqList = uniq(orderDataList.map(({ goods }) => goods.id));
  const groupById = groupByGoodsId(toGoods, usableGoodsCouponListSchema);
  const goodsInfos = seqList.map((seq) => groupById[seq]);

  return {
    goodsInfos,
  };
}

export function groupByGoodsId(
  goodsList: CheckoutGoodsModel[],
  usableGoodsCouponListSchema: CheckoutSchema['usableGoodsCoupon'],
): Record<number, CheckoutGoodsGroupModel> {
  return goodsList.reduce<Record<number, CheckoutGoodsGroupModel>>((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = {
        goodsId: item.id,
        goodsCode: item.code,
        goodsList: [],
        couponList: usableGoodsCouponListSchema?.[item.id]?.map(toCheckoutCouponModel) ?? [],
      };
    }

    acc[item.id].goodsList.push(item);
    return acc;
  }, {});
}

export function toCheckoutRecipientInfoModel(schema: CheckoutRecipientSchema): CheckoutRecipientInfoModel {
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

function toCheckoutGoodsImageModel(schema: CheckoutImageSchema): CheckoutGoodsPictureModel {
  return { ...schema, path: getImageLink(schema.path, 512) };
}

export function toCheckoutOrdererInfoModel(schema: CheckoutOrdererSchema): CheckoutOrdererInfoModel {
  return { ...schema };
}

export function toCheckoutSummaryModel(schema: CheckoutPaymentSchema): CheckoutSummaryModel {
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

export function toCheckoutPaymentModel(schema: CheckoutPaymentSchema): CheckoutPaymentModel {
  const { savedPaymentType, availablePaymentTypes, paymentBenefitList } = schema;
  const isAvailablePoint = availablePaymentTypes.includes(PAYMENT_TYPE.POINT);
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
    isAvailablePoint,
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

function getBenefitByPgType(pgType: PGType, benefits: CheckoutPaymentSchema['paymentBenefitList']) {
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

function getGoodsOptionValues(schema: CheckoutOptionSchema) {
  return schema.itemList.map((item) => item.value);
}
