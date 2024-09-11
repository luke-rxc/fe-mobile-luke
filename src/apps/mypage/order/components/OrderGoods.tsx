/* eslint-disable no-nested-ternary */
import styled, { useTheme } from 'styled-components';
import { UniversalLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { OrderGoodsListItem, OrderGoodsListItemProps } from '@pui/orderGoodsListItem/v2';

export type OrderGoodsProps = Pick<
  OrderGoodsListItemProps,
  'link' | 'price' | 'brandName' | 'goodsName' | 'goodsImage' | 'className' | 'options' | 'quantity' | 'ticketValidity'
> & {
  goodsId?: number;
  code: string;
  /** 주문 상태별 display text */
  statusText?: string;
  /** 주문 상태 */
  status?: 'REQUESTED' | 'COMPLETED';
  /** 체크박스 사용 유무 */
  selectable?: boolean;
  /** 체크박스 버튼 체크 상태 변경 이벤트 */
  onChange?: () => void;
  /** 화면 이동 액션 비활성화 */
  disabledLink?: boolean;
};

export const OrderGoods = styled(
  ({
    code,
    price,
    status,
    statusText,
    goodsImage,
    link,
    options,
    quantity,
    selectable,
    goodsId,
    disabledLink = false,
    onChange,
    ...props
  }: OrderGoodsProps) => {
    const theme = useTheme();
    const { getLink } = useLink();
    /** 랜딩 URL */
    const goodsLink = link || getLink(UniversalLinkTypes.GOODS, { goodsCode: code });
    /** 주문 상태에 따른 tint 색상 */
    const orderStatusColor =
      //  요청중
      status === 'REQUESTED'
        ? theme.color.red
        : // 완료
        status === 'COMPLETED'
        ? theme.color.gray50
        : // 그외 기타
          theme.color.brand.tint;

    return (
      <OrderGoodsListItem
        link={disabledLink ? undefined : goodsLink}
        price={price}
        consumerPrice={price}
        orderStatus={statusText}
        orderStatusColor={orderStatusColor}
        goodsImage={goodsImage}
        options={options}
        quantity={quantity}
        selectable={selectable}
        onChange={onChange}
        {...props}
      />
    );
  },
)``;
