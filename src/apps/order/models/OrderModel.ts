import { toDateFormat } from '@utils/date';
import { toKRW } from '@utils/toKRW';
import { phoneNumberToString } from '@features/delivery/utils';
import { getImageLink } from '@utils/link';
import { add } from 'date-fns';
import cloneDeep from 'lodash/cloneDeep';
import {
  CheckoutGoodsSchema,
  ItemOptionSchema,
  OrderOrdererInfoSchema,
  OrderPaymentInfoSchema,
  OrderRecipientInfoSchema,
  OrderSchema,
  OrderStatusSchema,
  ORDER_STEP,
} from '../schemas';
import { getDateRangeText } from '../utils';
import { OrderCompleteErrorType, OrderStatus } from '../types';
import { ActionType, Navigation, ORDER_COMPLETE_DEFAULT_TITLE } from '../constants';

type Action =
  | {
      type: 'DEFAULT';
      list: Navigation[];
    }
  | {
      type: 'NOT_ADDRESS';
      list: Navigation[];
    }
  | {
      type: 'AIRLINE_TICKET';
      expiryDate: number;
      list: Navigation[];
    };

export type OrderErrorData = {
  type: OrderCompleteErrorType;
  message?: string;
};

export interface OrderModel {
  orderId: number;
  checkoutId: number | null;
  orderStatus: OrderStatus;
  orderer: OrderOrdererInfoModel;
  payment: OrderPaymentInfoModel;
  recipient: OrderRecipientInfoModel;
  itemOptionList: ItemOptionModel[];
  goodsType: string;
  error?: OrderErrorData;
  action: Action;
  title: string;
  description: string;
}

export type OrderStatusModel = OrderStatusSchema;
export type OrderOrdererInfoModel = OrderOrdererInfoSchema;

export interface OrderPaymentInfoModel extends OrderPaymentInfoSchema {
  orderPriceText: string;
  paymentText: string;
  paymentDateText: string;
  totalSalesPriceText: string;
  totalShippingCostText: string;
  totalDiscountPrice: number;
  totalDiscountPriceText: string;
}
export interface OrderRecipientInfoModel extends OrderRecipientInfoSchema {
  addressText: string;
}

export interface ItemOptionModel extends ItemOptionSchema {
  options: string[];
}

export function toOrderModel(schema: OrderSchema): OrderModel & { loggingData: OrderModel } {
  const orderStatus = toOrderStatus(schema);
  const { checkoutId, orderId } = schema;

  return {
    orderStatus,
    checkoutId,
    orderId,
    orderer: toOrderOrdererInfoModel(schema.orderer),
    ...(schema.payment && {
      payment: {
        ...toOrderPaymentInfoModel(schema.payment),
        ...(!schema.recipient?.isAddressRequired && { totalShippingCostText: '' }),
      },
    }),
    ...(schema.recipient && { recipient: toOrderRecipientInfoModel(schema.recipient) }),
    itemOptionList: toOrderDateItemList(schema).itemOptionList?.map(toItem) ?? [],
    goodsType: schema.goodsType,
    title: schema.title || ORDER_COMPLETE_DEFAULT_TITLE,
    description: schema.description ?? '',
    action: toAction(schema),
    ...(orderStatus === OrderStatus.ERROR && { error: toErrorData(schema) }),
    /**
     * 날짜 지정 대응으로 인해 model data를 강제로 수정하기 때문에
     * 기존 로깅 로직을 동일하게 적용하기 어려워
     * 로깅시 해당 필드를 사용하도록 하기위함
     *
     * 추후 데이터를 서버 응답으로 대체가 가능한 시점에 제거필요
     */
    loggingData: toLoggingData(schema),
  };
}

export function toLoggingData(schema: OrderSchema): OrderModel {
  const orderStatus = toOrderStatus(schema);
  const { checkoutId, orderId } = schema;

  return {
    orderStatus,
    checkoutId,
    orderId,
    orderer: toOrderOrdererInfoModel(schema.orderer),
    ...(schema.payment && {
      payment: {
        ...toOrderPaymentInfoModel(schema.payment),
        ...(!schema.recipient?.isAddressRequired && { totalShippingCostText: '' }),
      },
    }),
    ...(schema.recipient && { recipient: toOrderRecipientInfoModel(schema.recipient) }),
    itemOptionList: schema.itemOptionList?.map(toItem) ?? [],
    goodsType: schema.goodsType,
    title: schema.title || ORDER_COMPLETE_DEFAULT_TITLE,
    description: schema.description ?? '',
    action: toAction(schema),
    ...(orderStatus === OrderStatus.ERROR && { error: toErrorData(schema) }),
  };
}

function toItem(schema: ItemOptionSchema): ItemOptionModel {
  return {
    ...schema,
    goods: {
      ...schema.goods,
      primaryImage: {
        ...schema.goods.primaryImage,
        path: getImageLink(schema.goods.primaryImage.path, 512),
      },
    },
    options: getOptionValues(schema.goods),
  };
}

export function toOrderDateItemList(schema: OrderSchema): OrderSchema {
  if (schema.isConsecutiveStay && schema.itemOptionList && schema.itemOptionList.length > 0) {
    const { itemOptionList } = schema;
    const [first] = itemOptionList;
    const last = itemOptionList.slice(-1)[0];
    const bookingStartDate = first.goods.option.bookingDate;
    const bookingEndDate = add(last.goods.option.bookingDate, { days: 1 }).getTime();
    const copy = cloneDeep(first);
    const bookingDateIndex = Math.max((first.goods.option.optionPositionBookingDate ?? 1) - 1, 0);
    const date = copy.goods.option.itemList[bookingDateIndex];
    copy.priceWithEa = schema.payment.totalSalesPrice;
    date.value = getDateRangeText(bookingStartDate, bookingEndDate, itemOptionList.length);

    return {
      ...schema,
      itemOptionList: [copy],
    };
  }

  return schema;
}

function toOrderOrdererInfoModel(schema: OrderOrdererInfoSchema): OrderOrdererInfoModel {
  return { ...schema };
}

function toOrderPaymentInfoModel(schema: OrderPaymentInfoSchema): OrderPaymentInfoModel {
  const totalDiscountPrice = schema.usedCartCouponSale + schema.usedGoodsCouponSale + schema.usedPoint;

  return {
    ...schema,
    orderPriceText: toKRW(schema.amount),
    totalSalesPriceText: toKRW(schema.totalSalesPrice),
    totalShippingCostText: toKRW(schema.totalShippingCost),
    paymentText: schema.paymentType.name,
    paymentDateText: toDateFormat(schema.paymentDate, 'yyyy.M.d HH:mm'),
    totalDiscountPrice,
    totalDiscountPriceText: toKRW(totalDiscountPrice > 0 ? totalDiscountPrice * -1 : 0),
  };
}

function toOrderRecipientInfoModel(schema: OrderRecipientInfoSchema): OrderRecipientInfoModel {
  return {
    ...schema,
    addressText: `${schema.address} ${schema.addressDetail}`.trim(),
    phone: phoneNumberToString(schema.phone),
  };
}

function toAction(schema: OrderSchema): Action {
  /* cspell: disable-next-line */
  const list = (schema.navigations ?? []) as Navigation[];

  if (schema.isRequiredInputForm && schema.inputFormInfo?.sectionType === ActionType.AIRLINE_TICKET) {
    return {
      type: ActionType.AIRLINE_TICKET,
      expiryDate: schema.inputFormInfo.expiryDate,
      list,
    };
  }

  if (!schema.recipient?.isAddressRequired) {
    return { type: ActionType.NOT_ADDRESS, list };
  }

  return { type: ActionType.DEFAULT, list };
}

function getOptionValues(schema: CheckoutGoodsSchema): string[] {
  return schema.option.itemList.map((item) => item.value);
}

function toOrderStatus(schema: OrderSchema) {
  const {
    orderStatus: { step },
    isFinished,
  } = schema;

  if (!isFinished) {
    if (step === ORDER_STEP.LOADING) {
      return OrderStatus.LOADING;
    }

    return OrderStatus.ERROR;
  }

  if (step === ORDER_STEP.PAY_FAIL) {
    return OrderStatus.ERROR;
  }

  return OrderStatus.SUCCESS;
}

function toErrorData(schema: OrderSchema): OrderErrorData {
  const {
    isFinished,
    failure,
    orderStatus: { step },
  } = schema;
  const base = { message: failure?.message };

  if (!isFinished) {
    if (failure?.code === 'OVER_ORDER_QUANTITY') {
      return {
        ...base,
        type: OrderCompleteErrorType.OVER_ORDER_QUANTITY,
      };
    }

    if (failure?.code === 'LOCK_TIMEOUT') {
      return {
        ...base,
        type: OrderCompleteErrorType.LOCK_TIMEOUT,
      };
    }
  }

  if (step === ORDER_STEP.PAY_FAIL) {
    return {
      ...base,
      type: OrderCompleteErrorType.FAIL,
    };
  }

  return {
    ...base,
    type: OrderCompleteErrorType.NOT_FOUND,
  };
}
