import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { UniversalLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { List } from '@pui/list';
import { Button } from '@pui/button';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useQueryString } from '@hooks/useQueryString';
import { useEffect } from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { TitleSection } from '@pui/titleSection';
import { useWebInterface } from '@hooks/useWebInterface';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { useClaimCancelTicketService, useClaimCancelReasonService } from '../services';
import { Main, Section, EstimatedRefundInfo, OrderGoods, RefundReason, CancellationInfo } from '../components';
import { ClaimManageInfo, ClaimTypes, TicketCancelInfoText, ProcessTypes } from '../constants';
import { useClaimNavigate } from '../hooks';

interface UrlParams {
  orderId: string;
  processType: ValueOf<typeof ProcessTypes>;
}

interface QueryParams {
  exportId?: string;
}

export const ClaimCancelTicketContainer = () => {
  // URL Parameter
  const { orderId, processType } = useParams<UrlParams>();
  const { exportId } = useQueryString<QueryParams>();
  const { toLink, getLink } = useLink();
  const { handleNavigate, handleDismissConfirm } = useClaimNavigate();
  const { setTopBar } = useWebInterface();
  const { isIOS, isApp } = useDeviceDetect();
  const {
    orderDetail,
    orderDetailError,
    isOrderDetailError,
    isOrderDetailLoading,
    isOrderCancelling,
    handleOrderCancel,
    handleLogCancelPolicyMore,
    handleAllowedNavigation,
  } = useClaimCancelTicketService({ orderId, exportId, processType });
  const { isAddressRequired, orderCancelGoods, refundInfo, cancellationInfo } = orderDetail || {};

  const {
    reasonItems,
    reasonItemsError,
    isReasonItemsError,
    isReasonItemsLoading,
    handleChangeReasonCode,
    handleChangeReason,
    reasonCode,
    reason,
    isReasonError,
    isEtcReasonCode,
    isValid,
  } = useClaimCancelReasonService({
    orderId,
    goodsKind: 'TICKET',
    processType,
    ...(exportId && { exportId: +exportId }),
    claimType: 'TICKET_REFUND_REQUEST',
  });

  const goToOrderHistory = () => {
    toLink(getLink(UniversalLinkTypes.ORDER_HISTORY));
  };

  useEffect(() => {
    isOrderCancelling && handleAllowedNavigation(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOrderCancelling]);

  const loading = useLoadingSpinner(isOrderDetailLoading || isReasonItemsLoading);

  useEffect(() => {
    handleDismissConfirm({
      title: TicketCancelInfoText.DISMISS_TITLE,
      cancelButtonTitle: TicketCancelInfoText.CONFIRM.CANCEL_BUTTON_TITLE,
    });
    if (isApp) {
      setTopBar({
        title: ClaimManageInfo.TICKET_REFUND_REQUEST.process?.[processType] || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApp, processType]);

  useHeaderDispatch({
    type: 'mweb',
    title: ClaimManageInfo.TICKET_REFUND_REQUEST.process?.[processType],
    quickMenus: ['cart', 'menu'],
    enabled: !isOrderDetailLoading && !isReasonItemsLoading,
  });

  if (loading) {
    return null;
  }

  if (isOrderDetailError || isReasonItemsError) {
    return (
      <PageError
        isFull
        error={orderDetailError || reasonItemsError}
        actionLabel="주문 목록으로 이동"
        onAction={goToOrderHistory}
      />
    );
  }
  return (
    <MainStyled className={isIOS && isApp ? 'is-ios-app' : ''}>
      {!isApp && <TitleSection title={ClaimManageInfo.TICKET_REFUND_REQUEST.process?.[processType]} />}
      {processType === ProcessTypes.REASON && (
        <>
          <RefundReason
            reasonCode={reasonCode}
            reasons={reasonItems}
            etcReason={reason}
            reasonError={isReasonError}
            showReasonText={isEtcReasonCode}
            onChangeCancelReason={handleChangeReasonCode}
            onChangeEtcReason={handleChangeReason}
          />
          <FloatingButtonWrapperStyled>
            <Button
              block
              bold
              size="large"
              variant="primary"
              disabled={!isValid}
              onClick={() => {
                isValid &&
                  handleNavigate({
                    orderId: Number(orderId),
                    queryObj: { exportId },
                    claimType: ClaimTypes.TICKET_REFUND_REQUEST,
                    processType: ProcessTypes.CONFIRM,
                    appLinkParams: { landingType: 'push', rootNavigation: false },
                    initialData: { reasonCode, ...(reason && { reason }) },
                  });
              }}
            >
              다음
            </Button>
          </FloatingButtonWrapperStyled>
        </>
      )}
      {/* 취소 요청 내역 */}
      {processType === ProcessTypes.CONFIRM && (
        /* 상품 목록 */
        <Section>
          <List source={orderCancelGoods} component={OrderGoods} />
        </Section>
      )}
      {processType === ProcessTypes.CONFIRM && cancellationInfo && (
        /* 취소 정보 */
        <SectionStyled divider spacing="s12">
          <CancellationInfo {...cancellationInfo} onExpandMoreSection={handleLogCancelPolicyMore} />
        </SectionStyled>
      )}
      {processType === ProcessTypes.CONFIRM && cancellationInfo && !cancellationInfo.isCancelFee && refundInfo && (
        /* 환불 정보 - 취소 수수료 내역 안내 전까지 수수료 부과 시 숨김 처리 */
        <SectionDetailStyled>
          <EstimatedRefundInfo showShippingAmount={isAddressRequired} {...refundInfo} />
        </SectionDetailStyled>
      )}
      {processType === ProcessTypes.CONFIRM && (
        /* 취소 버튼 */
        <FloatingButtonWrapperStyled>
          <Button block bold loading={isOrderCancelling} size="large" variant="primary" onClick={handleOrderCancel}>
            {ClaimManageInfo.TICKET_REFUND_REQUEST.process?.[processType]}
          </Button>
        </FloatingButtonWrapperStyled>
      )}
    </MainStyled>
  );
};

const MainStyled = styled(Main)`
  background: ${({ theme }) => theme.color.background.surface};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 10.4rem;
  &.is-ios-app {
    min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  }
`;

const FloatingButtonWrapperStyled = styled.div`
  position: fixed;
  ${({ theme }) => theme.mixin.safeArea('bottom', 24)};
  left: 0;
  width: 100%;
  z-index: 1;
  padding: ${({ theme }) => `${theme.spacing.s16} ${theme.spacing.s24} 0 ${theme.spacing.s24}`};
  ${Button} {
    width: 100%;
  }
`;

const SectionStyled = styled(Section)`
  padding-bottom: ${({ theme }) => `${theme.spacing.s24}`};
`;

const SectionDetailStyled = styled(Section)`
  padding-top: ${({ theme }) => `${theme.spacing.s12}`};
  background: ${({ theme }) => theme.color.backgroundLayout.section};
`;
