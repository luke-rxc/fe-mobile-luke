import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { UniversalLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { List } from '@pui/list';
import { Button } from '@pui/button';
import { TitleSection } from '@pui/titleSection';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useEffect } from 'react';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { useClaimCancelFullService, useClaimCancelReasonService } from '../services';
import { Main, Section, EstimatedRefundInfo, OrderGoods, RefundReason, CancellationInfo } from '../components';
import { useClaimNavigate } from '../hooks';
import { ClaimManageInfo, ClaimTypes, FullCancelInfoText, ProcessTypes } from '../constants';

interface UrlParams {
  orderId: string;
  processType: ValueOf<typeof ProcessTypes>;
}

export const ClaimCancelFullContainer = () => {
  // URL Parameter
  const { orderId, processType } = useParams<UrlParams>();
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
    handleAllowedNavigation,
  } = useClaimCancelFullService({ orderId, processType });
  const { orderCancelGoods, refundInfo, reasonText } = orderDetail || {};

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
  } = useClaimCancelReasonService({ orderId, processType, claimType: 'CANCEL_FULL_REQUEST' });

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
      title: FullCancelInfoText.DISMISS_TITLE,
      cancelButtonTitle: FullCancelInfoText.CONFIRM.CANCEL_BUTTON_TITLE,
    });
    if (isApp) {
      setTopBar({
        title: ClaimManageInfo.CANCEL_FULL_REQUEST.process?.[processType] || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApp, processType]);

  useHeaderDispatch({
    type: 'mweb',
    title: ClaimManageInfo.CANCEL_FULL_REQUEST.process?.[processType],
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
      {!isApp && <TitleSection title={ClaimManageInfo.CANCEL_FULL_REQUEST.process?.[processType]} />}
      {/* 취소 사유 */}
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
                    claimType: ClaimTypes.CANCEL_FULL_REQUEST,
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
        <Section>
          <List source={orderCancelGoods} component={OrderGoods} />
        </Section>
      )}
      {processType === ProcessTypes.CONFIRM && reasonText && (
        <SectionStyled divider spacing="s12">
          <CancellationInfo reasonText={reasonText} />
        </SectionStyled>
      )}
      {processType === ProcessTypes.CONFIRM && refundInfo && (
        /* 환불 정보 */
        <SectionDetailStyled>
          <EstimatedRefundInfo {...refundInfo} />
        </SectionDetailStyled>
      )}
      {processType === ProcessTypes.CONFIRM && (
        /* 취소 버튼 */
        <FloatingButtonWrapperStyled>
          <Button block bold loading={isOrderCancelling} size="large" variant="primary" onClick={handleOrderCancel}>
            {ClaimManageInfo.CANCEL_FULL_REQUEST.process?.[processType]}
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
  padding: ${({ theme }) => `${theme.spacing.s16} ${theme.spacing.s24} 0 ${theme.spacing.s24}`};
  z-index: 1;
  ${Button} {
    width: 100%;
  }
`;

const SectionStyled = styled(Section)`
  padding-bottom: ${({ theme }) => `${theme.spacing.s12}`};
`;

const SectionDetailStyled = styled(Section)`
  padding-top: ${({ theme }) => `${theme.spacing.s12}`};
  background: ${({ theme }) => theme.color.backgroundLayout.section};
`;
