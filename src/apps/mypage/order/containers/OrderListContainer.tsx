import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { List } from '@pui/list';
import { Divider } from '@pui/divider';
import { TitleSection } from '@pui/titleSection';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { rn2br } from '@utils/string';
import { PageError } from '@features/exception/components';
import { useOrderListService } from '../services';
import { Main, Section, OrderTitle, OrderGoods, LoadingSpinner } from '../components';

/**
 * @todo 추후 PageError에 isFull props 반영시 삭제
 */
const PageErrorWrap = styled.div`
  ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
  ${({ theme }) => theme.mixin.centerItem()};
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

/* eslint-disable @typescript-eslint/no-explicit-any */
export const OrderListContainer = styled(({ className }) => {
  const { isApp } = useDeviceDetect();

  const {
    orderList,
    hasMoreOrders,
    ordersError,
    isOrdersError,
    isOrdersLoading,
    isOrdersFetching,
    refetchOrderList,
    handleLoadOrders,
  } = useOrderListService();

  useHeaderDispatch({
    type: 'mweb',
    title: '주문 목록',
    quickMenus: ['cart', 'menu'],
    enabled: !isOrdersLoading,
  });

  /** Initialize Case UI */
  if (isOrdersLoading) {
    return <LoadingSpinner />;
  }

  /** Error Case UI */
  if (isOrdersError) {
    return <PageErrorWrap children={<PageError error={ordersError} />} />;
  }

  /** Empty Case UI */
  if (isEmpty(orderList)) {
    return (
      <PageErrorWrap
        children={<PageError defaultMessage={rn2br('주문한 상품이 없습니다\r\n상품을 발견하고 주문해보세요')} />}
      />
    );
  }

  return (
    <Main className={className} spacing="s12">
      {!isApp && <TitleSection title="주문 목록" />}
      <InfiniteScroller
        disabled={!hasMoreOrders || isOrdersFetching}
        loading={isOrdersFetching}
        onScrolled={handleLoadOrders}
      >
        {orderList.map(({ title, orders }) => (
          <Section key={title.orderId}>
            <OrderTitle {...title} />
            <Divider />
            <List
              source={orders}
              render={({ ticketValidity, ...source }) => (
                <OrderGoods
                  {...source}
                  {...(ticketValidity && { ticketValidity: { ...ticketValidity, onTicketExpired: refetchOrderList } })}
                />
              )}
            />
          </Section>
        ))}
      </InfiniteScroller>
    </Main>
  );
})`
  ${TitleSection} {
    background: ${({ theme }) => theme.color.background.surface};
  }

  ${Section}:last-of-type {
    padding-bottom: ${({ theme }) => theme.spacing.s24};
  }

  ${List} {
    padding: ${({ theme }) => `${theme.spacing.s12} 0`};
  }
`;
/* eslint-enable @typescript-eslint/no-explicit-any */
