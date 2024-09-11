import React from 'react';
import styled from 'styled-components';
import omit from 'lodash/omit';
import classnames from 'classnames';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { TitleSection } from '@pui/titleSection';
import { Divider } from '@pui/divider';
import { PageError } from '@features/exception/components';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { useLink } from '@hooks/useLink';
import { UniversalLinkTypes } from '@constants/link';
import { useOrderDetailsService } from '../services';
import {
  Main,
  Section,
  OrderTitle,
  OrderGoods,
  OrderActions,
  OrderClaimInfo,
  OrderNotice,
  RefundInfo,
  ShippingInfo,
  PaymentInfo,
  AdditionalInfo,
  TicketReservationInfo,
} from '../components';

export const OrderDetailsContainer = styled(({ className }) => {
  const { isApp } = useDeviceDetect();
  const {
    orderDetails,
    orderDetailsError,
    isOrderDetailSuccess,
    isOrderDetailError,
    isOrderDetailLoading,
    refetchOrderDetails,
    showChangeShippingAddressModal,
    handleTicketResend,
    additionalInfo,
    executeCancelPartialBundle,
    executeReturnBundle,
    executeExchangeBundle,
    executeWithdrawReturnExchange,
    orderCancelPartialError,
    orderReturnError,
    orderExchangeError,
    orderWithdrawError,
    handleClickMap,
    handleClickAddressCopy,
    ticketInfo,
  } = useOrderDetailsService();
  const { orderInfo, shippingInfo, paymentInfo, refundInfo } = orderDetails || {};
  const { isAddressRequired } = shippingInfo || {};
  const {
    data: additionalInfoData,
    ref: additionalInfoRef,
    handleConfirmAirlineTicket,
    isConfirmAirlineTicketLoading,
  } = additionalInfo;

  const { toLink, getLink } = useLink();

  const goToOrderHistory = () => {
    toLink(getLink(UniversalLinkTypes.ORDER_HISTORY));
  };

  const loading = useLoadingSpinner(isOrderDetailLoading);

  useHeaderDispatch({
    type: 'brand',
    title: isAddressRequired ? '주문 상세' : '예약 상세',
    quickMenus: ['cart', 'menu'],
    enabled: !isOrderDetailLoading,
  });

  if (loading) {
    return null;
  }

  /** Error Case UI */
  const isPageError =
    isOrderDetailError ||
    orderCancelPartialError?.data ||
    orderReturnError?.data ||
    orderWithdrawError?.data ||
    (orderExchangeError?.data && orderExchangeError?.data?.code !== 'E500A58');
  const errorData =
    orderDetailsError || orderCancelPartialError || orderReturnError || orderExchangeError || orderWithdrawError;
  if (isPageError) {
    return <PageError isFull error={errorData} actionLabel="주문 목록으로 이동" onAction={goToOrderHistory} />;
  }

  return (
    <Main spacing="s12" className={className}>
      {!isApp && isOrderDetailSuccess && <TitleSection title={isAddressRequired ? '주문 상세' : '예약 상세'} />}

      {/* 날짜 요청(확정) 정보 */}
      {ticketInfo && (
        <Section className={classnames('section-ticket', { 'is-reserved': !ticketInfo.ticketOptions?.length })}>
          <TicketReservationInfo {...ticketInfo} />
        </Section>
      )}

      {/* 주문 정보 */}
      {orderInfo && (
        <Section className="section-order">
          <OrderTitle {...omit(orderInfo.title, 'href')} />
          <Divider />
          {orderInfo.orders.map(({ optionId, exportId, goods, claim, actions, noticeMessage }) => (
            <React.Fragment key={[optionId, exportId].filter((v) => !!v).join('-')}>
              <OrderGoods
                {...goods}
                {...(goods.ticketValidity && {
                  ticketValidity: { ...goods.ticketValidity, onTicketExpired: refetchOrderDetails },
                })}
              />
              <OrderClaimInfo {...claim} />
              <OrderActions
                {...actions}
                onTicketResend={handleTicketResend}
                onCancelPartialBundle={executeCancelPartialBundle}
                onReturnBundle={executeReturnBundle}
                onExchangeBundle={executeExchangeBundle}
                onWithDrawReturnChange={executeWithdrawReturnExchange}
              />
              <OrderNotice noticeMessage={noticeMessage} />
            </React.Fragment>
          ))}
        </Section>
      )}

      {additionalInfoData && (
        <Section ref={additionalInfoRef}>
          <AdditionalInfo
            data={additionalInfoData}
            handleConfirmAirlineTicket={handleConfirmAirlineTicket}
            isConfirmAirlineTicketLoading={isConfirmAirlineTicketLoading}
          />
        </Section>
      )}

      {/* 배송정보 정보 */}
      {shippingInfo && (
        <Section>
          <ShippingInfo
            {...shippingInfo}
            onClickChangeShippingAddress={showChangeShippingAddressModal}
            onClickMap={handleClickMap}
            onClickAddressCopy={handleClickAddressCopy}
          />
        </Section>
      )}

      {/* 결제 정보 */}
      {paymentInfo && (
        <Section>
          <PaymentInfo {...paymentInfo} />
        </Section>
      )}

      {/* 환불 정보 */}
      {refundInfo && (
        <Section>
          <RefundInfo {...refundInfo} />
        </Section>
      )}
    </Main>
  );
})`
  ${TitleSection} {
    background: ${({ theme }) => theme.color.background.surface};
  }

  ${TitleSection} + ${Section},
  ${Section}:first-child {
    margin-top: 0;
  }

  .section-ticket.is-reserved + .section-order {
    margin-top: 0;
  }

  .section-order {
    padding-bottom: ${({ theme }) => theme.spacing.s24};

    ${Divider} + ${OrderGoods} {
      margin-top: ${({ theme }) => theme.spacing.s12};
    }

    ${OrderClaimInfo} {
      margin: ${({ theme }) => `0 ${theme.spacing.s24} ${theme.spacing.s12} ${theme.spacing.s24}`};
    }

    ${OrderActions} {
      margin: ${({ theme }) => `0 ${theme.spacing.s24} ${theme.spacing.s12} ${theme.spacing.s24}`};

      &:last-child {
        margin-bottom: 0;
      }
    }

    ${OrderActions} + ${OrderNotice} {
      margin-top: ${({ theme }) => `-${theme.spacing.s12}`};
    }
  }
`;
