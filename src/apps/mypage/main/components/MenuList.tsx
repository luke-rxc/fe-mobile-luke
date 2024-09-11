import { WebLinkTypes } from '@constants/link';
import { useLoading } from '@hooks/useLoading';
import { Action } from '@pui/action';
import { getWebLink } from '@utils/link';
import { toKRW } from '@utils/toKRW';
import { useEffect } from 'react';
import styled from 'styled-components';

interface Props {
  isLoading: boolean;
  couponCount?: number;
  point?: number;
  isPrizmPayReRegistrationRequired?: boolean;
}

export const MenuList = ({ isLoading, couponCount, point, isPrizmPayReRegistrationRequired }: Props) => {
  const { showLoading, hideLoading } = useLoading();

  const itemList = [
    {
      key: WebLinkTypes.ORDER_HISTORY,
      label: '주문 목록',
    },
    {
      key: WebLinkTypes.FOLLOWING,
      label: '팔로잉',
    },
    {
      key: WebLinkTypes.COUPON,
      label: '쿠폰',
      value: couponCount && couponCount > 0 ? `${couponCount}장` : '',
    },
    {
      key: WebLinkTypes.POINT,
      label: '적립금',
      value: point && point > 0 ? toKRW(point) : '',
    },
    {
      key: WebLinkTypes.MANAGE_PAY,
      label: '프리즘페이 관리',
      value: isPrizmPayReRegistrationRequired ? '카드 재등록' : '',
    },
    {
      key: WebLinkTypes.MANAGE_DELIVERY,
      label: '배송지 관리',
    },
  ];

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      {!isLoading && (
        <List>
          {itemList.map((item) => {
            return (
              <Item key={item.key}>
                <Action is="a" link={getWebLink(item.key)}>
                  {item.label} {item.value && <Value>{item.value}</Value>}
                </Action>
              </Item>
            );
          })}
        </List>
      )}
    </>
  );
};

const List = styled.ul`
  padding: 1.2rem 0 2.4rem;
`;

const Item = styled.li`
  ${Action} {
    display: block;
    position: relative;
    padding: 0 2.4rem;
    font-size: ${({ theme }) => theme.fontSize.s15};
    color: ${({ theme }) => theme.color.black};
    line-height: 5.6rem;
  }
`;

const Value = styled.div`
  position: absolute;
  top: 50%;
  right: 2.4rem;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  transform: translateY(-50%);
`;
