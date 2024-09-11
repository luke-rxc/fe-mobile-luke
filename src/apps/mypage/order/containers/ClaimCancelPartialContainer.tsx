import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { UniversalLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { List } from '@pui/list';
import { Button } from '@pui/button';
import { TitleSection } from '@pui/titleSection';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useQueryString } from '@hooks/useQueryString';
import { useEffect } from 'react';
import { Divider } from '@pui/divider';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { useClaimCancelPartialService, useClaimCancelReasonService } from '../services';
import { Main, Section, EstimatedRefundInfo, OrderGoods, RefundReason, CancellationInfo } from '../components';
import { useClaimNavigate } from '../hooks';
import { ClaimManageInfo, ClaimTypes, PartialCancelInfoText, ProcessTypes } from '../constants';
import { CollapseSection } from '../components/CollapseSection';

interface UrlParams {
  orderId: string;
  processType: ValueOf<typeof ProcessTypes>;
}

interface QueryParams {
  itemId?: string;
  itemOptionId?: string;
  hasBundle?: string;
}

export const ClaimCancelPartialContainer = () => {
  // URL Parameter
  const { orderId, processType } = useParams<UrlParams>();
  const { itemId, itemOptionId, hasBundle } = useQueryString<QueryParams>();
  const { toLink, getLink } = useLink();
  const { handleNavigate, handleDismissConfirm } = useClaimNavigate();
  const { setTopBar } = useWebInterface();
  const { isIOS, isApp } = useDeviceDetect();

  const {
    cancelPartialDetailQuery,
    cancelPartialBundleQuery,
    selectedBundleGoods,
    isOrderCancelling,
    itemInfoList,
    handleOrderCancel,
    handleChangeBundleGoods,
    handleAllowedNavigation,
  } = useClaimCancelPartialService({
    orderId,
    itemId,
    itemOptionId,
    processType,
    hasBundle,
  });
  const {
    data: cancelDetailData,
    error: cancelDetailError,
    isError: isCancelDetailError,
    isLoading: isCancelDetailLoading,
  } = cancelPartialDetailQuery;

  const { data: cancelBundleData } = cancelPartialBundleQuery;

  const { orderCancelGoods, refundInfo, cancellationInfo } = cancelDetailData || {};

  const { orderCancelTargetGoods, orderCancelBundleGoods } = cancelBundleData || {};

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
    processType,
    itemInfoList,
    claimType: 'REFUND_REQUEST',
  });

  const goToOrderHistory = () => {
    toLink(getLink(UniversalLinkTypes.ORDER_HISTORY));
  };

  useEffect(() => {
    isOrderCancelling && handleAllowedNavigation(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOrderCancelling]);

  const loading = useLoadingSpinner(isCancelDetailLoading || isReasonItemsLoading);

  useEffect(() => {
    handleDismissConfirm({
      title: PartialCancelInfoText.DISMISS_TITLE,
      cancelButtonTitle: PartialCancelInfoText.CONFIRM.CANCEL_BUTTON_TITLE,
    });
    if (isApp) {
      setTopBar({
        title: ClaimManageInfo.REFUND_REQUEST.process?.[processType] || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApp, processType]);

  useHeaderDispatch({
    type: 'mweb',
    title: ClaimManageInfo.REFUND_REQUEST.process?.[processType],
    quickMenus: ['cart', 'menu'],
    enabled: !isCancelDetailLoading && !isReasonItemsLoading,
  });

  if (loading) {
    return null;
  }

  if (isCancelDetailError || isReasonItemsError) {
    return (
      <PageError
        isFull
        error={cancelDetailError || reasonItemsError}
        actionLabel="주문 목록으로 이동"
        onAction={goToOrderHistory}
      />
    );
  }

  return (
    <MainStyled className={isIOS && isApp ? 'is-ios-app' : ''}>
      {!isApp && <TitleSectionStyled title={ClaimManageInfo.REFUND_REQUEST.process?.[processType]} />}
      {processType === ProcessTypes.BUNDLE && orderCancelTargetGoods && orderCancelBundleGoods && (
        <>
          <OrderGoods {...orderCancelTargetGoods} />
          <DividerStyled t="1.2rem" />
          <CollapseSectionStyled title="함께 취소 가능한 상품" defaultExpanded={false}>
            <List
              source={orderCancelBundleGoods}
              getKey={(item) => `${item.id}`}
              render={(bundleGoods) => (
                <OrderGoods
                  {...bundleGoods}
                  selectable
                  onChange={() => handleChangeBundleGoods({ itemOptionId: bundleGoods.id, itemId: bundleGoods.itemId })}
                />
              )}
            />
          </CollapseSectionStyled>
          <FloatingButtonWrapperStyled>
            <Button
              block
              bold
              size="large"
              variant="primary"
              onClick={() => {
                handleNavigate({
                  orderId: Number(orderId),
                  claimType: ClaimTypes.REFUND_REQUEST,
                  processType: ProcessTypes.REASON,
                  appLinkParams: { landingType: 'push', rootNavigation: false },
                  initialData: {
                    itemInfoList: [
                      { itemId: orderCancelTargetGoods.itemId, itemOptionId: orderCancelTargetGoods.id },
                      ...selectedBundleGoods,
                    ],
                  },
                });
              }}
            >
              다음
            </Button>
          </FloatingButtonWrapperStyled>
        </>
      )}
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
                    claimType: ClaimTypes.REFUND_REQUEST,
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
      {processType === ProcessTypes.CONFIRM && cancellationInfo && (
        <SectionStyled spacing="s12" divider>
          <CancellationInfo {...cancellationInfo} />
        </SectionStyled>
      )}
      {/* 환불 정보 */}
      {processType === ProcessTypes.CONFIRM && refundInfo && (
        <SectionDetailStyled>
          <EstimatedRefundInfo {...refundInfo} />
        </SectionDetailStyled>
      )}
      {processType === ProcessTypes.CONFIRM && (
        /* 취소 버튼 */
        <FloatingButtonWrapperStyled>
          <Button block bold loading={isOrderCancelling} size="large" variant="primary" onClick={handleOrderCancel}>
            {ClaimManageInfo.REFUND_REQUEST.process?.[processType]}
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

const TitleSectionStyled = styled(TitleSection)`
  background: ${({ theme }) => theme.color.background.surface};
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

const CollapseSectionStyled = styled(CollapseSection)`
  .title {
    font: ${({ theme }) => theme.fontType.mediumB};
    color: ${({ theme }) => theme.color.text.textPrimary};
  }
`;

const SectionStyled = styled(Section)`
  padding-bottom: ${({ theme }) => `${theme.spacing.s12}`};
`;

const DividerStyled = styled(Divider)`
  background: ${({ theme }) => theme.color.background.surface};
`;

const SectionDetailStyled = styled(Section)`
  padding-top: ${({ theme }) => `${theme.spacing.s12}`};
  background: ${({ theme }) => theme.color.backgroundLayout.section};
`;
