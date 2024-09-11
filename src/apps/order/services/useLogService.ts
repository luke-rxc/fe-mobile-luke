import { AppLogTypes, WebLogTypes } from '@constants/log';
import { PGType } from '@constants/order';
import { createDebug } from '@utils/debug';
import { tracking } from '@utils/log';
import {
  CartEventTypes,
  CartWebBranchTypes,
  CartLogEventTypes,
  CartLogWebBranchTypes,
  OrderEventTypes,
  OrderWebBranchTypes,
  OrderLogEventTypes,
  OrderLogWebBranchTypes,
  LogEventWebFacebookTypes,
} from '../constants/log';
import { BidCheckoutModel, CheckoutModel, OrderModel } from '../models';
import { CheckoutPaymentGateWaySchema } from '../schemas';
import { uniq } from '../utils';

export const debugCart = createDebug('Cart:debug');

interface LogTrackingTarget {
  web?: WebLogTypes[];
  app?: AppLogTypes[];
}

const toString = (value: number | null) => {
  if (value === null) {
    return '';
  }

  return `${value}`;
};

/* eslint-disable @typescript-eslint/naming-convention */
export const useCartLogService = () => {
  const log = (
    eventName: CartEventTypes | CartWebBranchTypes,
    params: Record<string, unknown>,
    targets: LogTrackingTarget,
  ) => {
    debugCart.log(`eventName: ${eventName}`, params, targets);
    tracking.logEvent({
      name: eventName,
      parameters: params,
      targets,
    });
  };

  const logViewCart = (params: { orderCount: number; orderPrice: number }) => {
    const { orderCount: order_quantity, orderPrice: amount } = params;
    log(
      CartLogEventTypes.LogViewCart,
      { order_quantity, amount },
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Branch, AppLogTypes.Firebase],
        web: [WebLogTypes.MixPanel],
      },
    );
    log(
      CartLogWebBranchTypes.LogViewCart,
      { order_quantity },
      {
        web: [WebLogTypes.Branch],
      },
    );
  };

  const logRemoveFromCart = (params: { id: number; name: string; goodsStatusText: string }) => {
    const { id, name: goods_name, goodsStatusText: option_status } = params;
    log(
      CartLogEventTypes.LogRemoveFromCart,
      { goods_id: `${id}`, goods_name, option_status },
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        web: [WebLogTypes.MixPanel],
      },
    );
  };

  const logTabPurchase = (params: { orderCount: number; orderPrice: number }) => {
    const { orderCount: order_quantity, orderPrice: amount } = params;
    log(
      CartLogEventTypes.LogTabPurchase,
      { order_quantity, amount },
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    );
  };

  const logViewIdentifyAdult = () => {
    log(
      CartLogEventTypes.LogViewIdentifyAdult,
      {},
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        web: [WebLogTypes.MixPanel],
      },
    );
  };

  const logCompleteIdentifyAdult = (params: { status: boolean }) => {
    const { status: adult_status } = params;
    log(
      CartLogEventTypes.LogCompleteIdentifyAdult,
      { adult_status },
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        web: [WebLogTypes.MixPanel],
      },
    );
  };

  const logTabRecentGoods = (params: { goodsId: number; goodsName: string }) => {
    const { goodsId, goodsName: goods_name } = params;
    log(
      CartLogEventTypes.LogTabRecentGoods,
      { goods_id: `${goodsId}`, goods_name },
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    );
  };

  return {
    logViewCart,
    logRemoveFromCart,
    logTabPurchase,
    logViewIdentifyAdult,
    logCompleteIdentifyAdult,
    logTabRecentGoods,
  };
};

export const debugOrder = createDebug('Order:debug');

/* eslint-disable @typescript-eslint/naming-convention */
export const useOrderLogService = () => {
  const log = (
    eventName: OrderEventTypes | OrderWebBranchTypes,
    params: Record<string, unknown>,
    targets: LogTrackingTarget,
  ) => {
    debugOrder.log(`eventName: ${eventName}`, params, targets);
    tracking.logEvent({
      name: eventName,
      parameters: params,
      targets,
    });
  };

  const logViewCheckout = (params: CheckoutModel) => {
    const {
      orderer: { isIdentify: identify },
      cartCouponList,
      orderInfo: { goodsInfos },
      summaryInfo: { totalShippingCost: shipping_cost, orderPrice: amount },
      loggingData: { orderCount: order_quantity },
    } = params;

    const goodsCoupon = goodsInfos.some((goods) => goods.couponList.length > 0);
    const cartCoupon = cartCouponList.length > 0;

    log(
      OrderLogEventTypes.LogViewCheckout,
      {
        identify,
        goods_coupon: goodsCoupon,
        cart_coupon: cartCoupon,
        shipping_cost: shipping_cost > 0,
        order_quantity,
        amount,
      },
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Branch, AppLogTypes.Firebase],
        web: [WebLogTypes.MixPanel, WebLogTypes.Branch],
      },
    );
  };

  const logViewAuctionCheckout = (params: BidCheckoutModel) => {
    const {
      orderer: { isIdentify: identify },
      orderInfo: { goodsInfos },
      summaryInfo: { orderPrice: amount },
      paymentInfo: { availablePaymentTypes },
    } = params;

    const [goodsInfo] = goodsInfos;
    const { goodsList } = goodsInfo;
    const [goods] = goodsList;
    const {
      id,
      name: goods_name,
      brandId,
      brandName,
      showRoomId,
      option: { id: optionId },
    } = goods;

    log(
      OrderLogEventTypes.LogViewAuctionCheckout,
      {
        identify,
        prizm_pay: availablePaymentTypes.includes('PRIZM_PAY'),
        brand_id: toString(brandId),
        brand_name: brandName ?? '',
        showroom_id: toString(showRoomId),
        goods_id: `${id}`,
        goods_name,
        option_id: `${optionId}`,
        amount,
      },
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        web: [WebLogTypes.MixPanel],
      },
    );
  };

  const logCompleteIdentify = () => {
    log(
      OrderLogEventTypes.LogCompleteIdentify,
      {},
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        web: [WebLogTypes.MixPanel],
      },
    );
  };

  const logAddShippingAddress = () => {
    log(
      OrderLogEventTypes.LogAddShippingAddress,
      {},
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        web: [WebLogTypes.MixPanel],
      },
    );
  };

  const logAddPrizmPay = () => {
    log(
      OrderLogEventTypes.LogAddPrizmPay,
      {},
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Branch],
        web: [WebLogTypes.MixPanel],
      },
    );
    log(
      OrderLogWebBranchTypes.LogAddPrizmPay,
      {},
      {
        web: [WebLogTypes.Branch],
      },
    );
  };

  const logTabPaymentType = (paymentType: PGType) => {
    const payment_type = convertPaymentType(paymentType);

    log(
      OrderLogEventTypes.LogTabPaymentType,
      {
        payment_type,
      },
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        web: [WebLogTypes.MixPanel],
      },
    );
  };

  const convertPaymentType = (paymentType: PGType): string => {
    if (paymentType === PGType.CREDIT_CARD) {
      return 'card';
    }

    if (paymentType === PGType.KAKAO_PAY) {
      return 'kakaopay';
    }

    if (paymentType === PGType.NAVER_PAY) {
      return 'naverpay';
    }

    if (paymentType === PGType.TOSS_PAY) {
      return 'tosspay';
    }

    if (paymentType === PGType.PRIZM_PAY) {
      return 'prizmpay';
    }

    return '';
  };

  const logTabCheckout = () => {
    log(
      OrderLogEventTypes.LogTabCheckout,
      {},
      {
        web: [WebLogTypes.Facebook],
      },
    );
  };

  const logViewCheckoutOnPG = (params: { orderId: number; paymentGatewayParameter: CheckoutPaymentGateWaySchema }) => {
    const {
      orderId,
      paymentGatewayParameter: { payMethod: payment_type_on_pg, amount, pgForLog: pg },
    } = params;

    log(
      OrderLogEventTypes.LogViewCheckoutOnPG,
      {
        pg,
        payment_type_on_pg,
        order_id: `${orderId}`,
        amount,
      },
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage],
        web: [WebLogTypes.MixPanel],
      },
    );
  };

  const logCompleteOrder = (params: OrderModel & { auctionId?: string }) => {
    const {
      orderId,
      auctionId,
      itemOptionList,
      goodsType: goods_type,
      payment: {
        paymentType: { type },
        pgForLog: pg,
        amount,
        totalShippingCost: total_shipping_cost,
        usedGoodsCouponSale: goods_coupon_sale,
        usedCartCouponSale: cart_coupon_sale,
        usedCartCoupon,
        usedPoint: used_point,
      },
    } = params;
    const orderCount = itemOptionList?.length ?? 0;
    const cartCouponDiscountRate = usedCartCoupon?.discountRate ?? 0;
    const paymentType = uniq(used_point > 0 ? [type, 'POINT'] : [type]);
    const arrays = toItemArrays(itemOptionList);
    const totalOptionQuantity = arrays.option_quantity.reduce((acc, option) => acc + option, 0);
    const total_coupon_sale = goods_coupon_sale + cart_coupon_sale;
    const goods_kind = itemOptionList[0]?.goods.kind ?? null;

    if (usedCartCoupon) {
      arrays.coupon_id.push(`${usedCartCoupon.id}`);
      arrays.coupon_name.push(usedCartCoupon.name);
    }

    const logParams = {
      order_id: `${orderId}`,
      ...(auctionId && { auction_id: auctionId }),
      order_quantity: orderCount,
      goods_type,
      goods_kind,
      payment_type: paymentType,
      pg,
      amount,
      total_shipping_cost,
      total_coupon_sale,
      goods_coupon_sale,
      cart_coupon_sale,
      cart_coupon_discount_rate: cartCouponDiscountRate,
      used_point,
      af_currency: 'KRW',

      ...arrays,
      option_quantity: arrays.option_quantity.map((quantity) => Number(quantity)),
      total_option_quantity: totalOptionQuantity,
    };
    const logWebBranchParams = {
      transaction_id: logParams.order_id,
      revenue: logParams.amount,
      shipping: logParams.total_shipping_cost,
      currency: logParams.af_currency,
    };
    const logWebFacebookParams = {
      value: logParams.amount,
      currency: logParams.af_currency,
    };

    log(OrderLogEventTypes.LogCompleteOrder, logParams, {
      app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Branch, AppLogTypes.Firebase],
      web: [WebLogTypes.MixPanel],
    });
    log(OrderLogWebBranchTypes.LogCompleteOrder, logWebBranchParams, {
      web: [WebLogTypes.Branch],
    });
    log(LogEventWebFacebookTypes.LogCompleteOrder, logWebFacebookParams, {
      web: [WebLogTypes.Facebook],
    });
  };

  type DefaultValueType = {
    brand_id: string[];
    brand_name: string[];
    showroom_id: string[];
    showroom_name: string[];
    category_id_a: string[];
    category_id_b: string[];
    category_id_c: string[];
    category_name_a: string[];
    category_name_b: string[];
    category_name_c: string[];
    goods_id: string[];
    goods_name: string[];
    option_id: string[];
    option_quantity: number[];
    coupon_id: string[];
    coupon_name: string[];
    goods_coupon_discount_rate: number[];
    delivery_method: string[];
  };

  const toItemArrays = (items: OrderModel['itemOptionList']) => {
    const defaultValue: DefaultValueType = {
      brand_id: [],
      brand_name: [],
      showroom_id: [],
      showroom_name: [],
      category_id_a: [],
      category_id_b: [],
      category_id_c: [],
      category_name_a: [],
      category_name_b: [],
      category_name_c: [],
      goods_id: [],
      goods_name: [],
      option_id: [],
      option_quantity: [],
      coupon_id: [],
      coupon_name: [],
      goods_coupon_discount_rate: [],
      delivery_method: [],
    };

    return (
      items?.reduce((acc, item) => {
        const brandId = toString(item.brand?.id ?? null);
        const brandName = item.brand?.name ?? '';
        const showRoomId = toString(item.showRoom?.id ?? null);
        const showRoomName = item.showRoom?.name ?? '';
        const {
          goods: {
            categoryIdList,
            categoryNameList,
            shippingMethod: delivery_method,
            id: goods_id,
            name: goods_name,
            option: { id: option_id },
          },
          ea: option_quantity,
        } = item;
        const [category_id_a, category_id_b, category_id_c] = categoryIdList.map((category) => `${category}`);
        const [category_name_a, category_name_b, category_name_c] = categoryNameList;
        const couponId = toString(item.usedCoupon?.id ?? null);
        const couponName = item.usedCoupon?.name ?? '';
        const couponSaleDiscountRate = item.usedCoupon?.discountRate ?? 0;

        return {
          brand_id: acc.brand_id.concat(brandId),
          brand_name: acc.brand_name.concat(brandName),
          showroom_id: acc.showroom_id.concat(showRoomId),
          showroom_name: acc.showroom_name.concat(showRoomName),
          category_id_a: acc.category_id_a.concat(category_id_a ?? ''),
          category_id_b: acc.category_id_b.concat(category_id_b ?? ''),
          category_id_c: acc.category_id_c.concat(category_id_c ?? ''),
          category_name_a: acc.category_name_a.concat(category_name_a ?? ''),
          category_name_b: acc.category_name_b.concat(category_name_b ?? ''),
          category_name_c: acc.category_name_c.concat(category_name_c ?? ''),
          goods_id: acc.goods_id.concat(`${goods_id}`),
          goods_name: acc.goods_name.concat(goods_name),
          option_id: acc.option_id.concat(`${option_id}`),
          option_quantity: acc.option_quantity.concat(option_quantity),
          coupon_id: acc.coupon_id.concat(couponId),
          coupon_name: acc.coupon_name.concat(couponName),
          goods_coupon_discount_rate: acc.goods_coupon_discount_rate.concat(couponSaleDiscountRate),
          delivery_method: acc.delivery_method.concat(delivery_method),
        };
      }, defaultValue) ?? defaultValue
    );
  };

  const logTabToOrderDetail = () => {
    log(
      OrderLogEventTypes.LogTabToOrderDetail,
      {},
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    );
  };

  const logTabToHome = () => {
    log(
      OrderLogEventTypes.LogTabToHome,
      {},
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
      },
    );
  };

  const logTabToInputForm = () => {
    log(
      OrderLogEventTypes.LogTabToInputForm,
      {},
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    );
  };

  const logImpressionTimeout = (goodsId: string) => {
    log(
      OrderLogEventTypes.LogImpressionTimeout,
      { goods_id: goodsId },
      {
        app: [AppLogTypes.MixPanel, AppLogTypes.MoEngage, AppLogTypes.Prizm],
        web: [WebLogTypes.MixPanel],
      },
    );
  };

  return {
    logViewCheckout,
    logViewAuctionCheckout,
    logCompleteIdentify,
    logAddShippingAddress,
    logAddPrizmPay,
    logTabPaymentType,
    logTabCheckout,
    logViewCheckoutOnPG,
    logCompleteOrder,
    logTabToOrderDetail,
    logTabToHome,
    logTabToInputForm,
    logImpressionTimeout,
  };
};
