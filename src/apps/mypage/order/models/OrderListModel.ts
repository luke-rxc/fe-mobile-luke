import format from 'date-fns/format';
import { getImageLink } from '@utils/link';
import { UniversalLinkTypes } from '@constants/link';
import { toUniversalLink } from '../utils';
import { OrderListSchema } from '../schemas';
import { OrderTitleProps, OrderGoodsProps } from '../components';
import { toTicketValidityModel } from './OrderDetailsModel';

export type OrderListModel = {
  title: OrderTitleProps;
  orders: OrderGoodsProps[];
}[];

/**
 * 주문 내역 모델
 */
export const toOrderListModel = (schema: OrderListSchema): OrderListModel => {
  const { content } = schema;

  return content.map(({ orderId, createdDate, isOrderByExchange, itemOptionList }) => {
    const orderDetailsUrl = toUniversalLink(UniversalLinkTypes.ORDER_DETAIL, { orderId });

    return {
      title: {
        orderId,
        title: format(createdDate, 'yyyy. M. d'),
        href: orderDetailsUrl,
        isExchangeOrder: isOrderByExchange,
      },
      orders: itemOptionList.map(({ goods, brand, ea, statusInfo, priceWithEa, ticket, isShowEa }) => ({
        href: orderDetailsUrl,
        code: goods.code,
        price: priceWithEa,
        goodsName: goods.name,
        options: goods.option.itemList.map(({ value }) => value),
        quantity: isShowEa ? ea : null,
        goodsImage: { src: getImageLink(`${goods.primaryImage?.path}?im=Resize,width=512`) },
        brandName: brand?.name,
        status: statusInfo.status,
        statusText: statusInfo.name,
        ticketValidity: ticket && toTicketValidityModel(ticket),
      })),
    };
  });
};
