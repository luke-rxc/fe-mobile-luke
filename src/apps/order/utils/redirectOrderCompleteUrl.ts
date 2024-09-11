import qs from 'qs';
import { ORDER_COMPLETE_URL } from '../constants';
import { CHECKOUT_TYPE, PayRequestParam } from '../types';

export const redirectOrderCompleteUrl = (options: PayRequestParam): string => {
  const { orderId, type, auctionId, checkoutId, paymentGatewayParameter, expiredDate, goodsCode } = options;

  const queryParams = {
    type: type === CHECKOUT_TYPE.LIVE ? CHECKOUT_TYPE.LIVE : CHECKOUT_TYPE.DEFAULT,
    pg_type: paymentGatewayParameter.pgType,
    ...(auctionId && { auction_id: auctionId }),
    ...(checkoutId && { checkout_id: checkoutId }),
    ...(goodsCode && { goods_code: goodsCode }),
    ...(expiredDate && { expired_date: expiredDate }),
  };

  return `${ORDER_COMPLETE_URL}/${orderId}?${qs.stringify(queryParams)}`;
};
