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
import {
  useClaimReturnMethodService,
  useClaimReturnReasonService,
  useClaimReturnService,
  useClaimUploadService,
} from '../services';
import { Main, Section, EstimatedRefundInfo, OrderGoods, ReturnReason, ClaimDetailInfo } from '../components';
import { useClaimNavigate } from '../hooks';
import { ClaimManageInfo, ClaimTypes, ProcessTypes, ReturnInfoText } from '../constants';
import { CollapseSection } from '../components/CollapseSection';
import { RecallMethod } from '../components/ReCallMethod';

interface UrlParams {
  orderId: string;
  processType: ValueOf<typeof ProcessTypes>;
}

interface QueryParams {
  itemId?: string;
  itemOptionId?: string;
  exportId?: string;
  hasBundle?: string;
}

export const ClaimReturnContainer = () => {
  // URL Parameter
  const { orderId, processType } = useParams<UrlParams>();
  const { itemId, itemOptionId, exportId, hasBundle } = useQueryString<QueryParams>();
  const { toLink, getLink } = useLink();
  const { handleNavigate, handleDismissConfirm } = useClaimNavigate();
  const { setTopBar } = useWebInterface();
  const { isIOS, isApp } = useDeviceDetect();

  const {
    returnDetailQuery,
    returnBundleQuery,
    selectedBundleGoods,
    isOrderReturning,
    handleOrderReturn,
    handleChangeBundleGoods,
    handleAllowedNavigation,
    itemInfoList,
  } = useClaimReturnService({
    orderId,
    itemId,
    itemOptionId,
    exportId,
    processType,
    hasBundle,
  });
  const {
    data: returnDetailData,
    error: returnDetailError,
    isError: isReturnDetailError,
    isLoading: isReturnDetailLoading,
  } = returnDetailQuery;

  const {
    data: returnBundleData,
    error: returnBundleError,
    isError: isReturnBundleError,
    isLoading: isReturnBundleLoading,
  } = returnBundleQuery;

  const { orderReturnGoods, refundInfo, returnSender, returnMethod, returnReasonItem } = returnDetailData || {};

  const { orderReturnTargetGoods, orderReturnBundleGoods } = returnBundleData || {};

  const {
    reasonItems,
    reasonItemsError,
    isReasonItemsError,
    isReasonItemsLoading,
    handleChangeReasonCode,
    handleChangeDetailCause,
    reasonCode,
    sellerCause,
    estimatedReturnShippingCost,
    sellerCauseError,
    isValid,
    causeCode,
    causeName,
    isLoadingReturnShippingCost,
  } = useClaimReturnReasonService({ orderId, processType, itemInfoList, claimType: ClaimTypes.RETURN_REQUEST });

  const {
    selectedReturnMethod,
    isReturnMethodValid,
    returnMethodItems,
    returnMethodItemsError,
    isReturnMethodItemsError,
    isReturnMethodItemsLoading,
    handleChangeReturnMethod,
  } = useClaimReturnMethodService({
    orderId,
    processType,
    itemInfoList,
    claimType: 'return',
  });

  const { attachments, handleUploadFiles, handleDeleteFile, isLoadingUploadFile } = useClaimUploadService();

  const { returnMethodList, returnSenderInfo } = returnMethodItems || {};

  const goToOrderHistory = () => {
    toLink(getLink(UniversalLinkTypes.ORDER_HISTORY));
  };

  useEffect(() => {
    isOrderReturning && handleAllowedNavigation(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOrderReturning]);

  const loading = useLoadingSpinner(
    isReturnDetailLoading || isReturnBundleLoading || isReasonItemsLoading || isReturnMethodItemsLoading,
  );

  useEffect(() => {
    handleDismissConfirm({
      title: ReturnInfoText.DISMISS_TITLE,
    });
    if (isApp) {
      setTopBar({
        title: ClaimManageInfo.RETURN_REQUEST.process?.[processType] || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApp, processType]);

  useHeaderDispatch({
    type: 'mweb',
    title: ClaimManageInfo.RETURN_REQUEST.process?.[processType],
    quickMenus: ['cart', 'menu'],
    enabled: !isReturnDetailLoading && !isReturnBundleLoading && !isReasonItemsLoading,
  });

  if (loading) {
    return null;
  }

  if (isReturnDetailError || isReturnBundleError || isReasonItemsError || isReturnMethodItemsError) {
    return (
      <PageError
        isFull
        error={returnDetailError || returnBundleError || reasonItemsError || returnMethodItemsError}
        actionLabel="주문 목록으로 이동"
        onAction={goToOrderHistory}
      />
    );
  }

  return (
    <MainStyled className={isIOS && isApp ? 'is-ios-app' : ''}>
      {!isApp && <TitleSection title={ClaimManageInfo.RETURN_REQUEST.process?.[processType]} />}
      {/* 묶음 반품 가능한 상품 */}
      {processType === ProcessTypes.BUNDLE && orderReturnTargetGoods && orderReturnBundleGoods && (
        <>
          <OrderGoods {...orderReturnTargetGoods} />
          <Divider t="1.2rem" />
          <CollapseSectionStyled title="함께 반품 가능한 상품" defaultExpanded={false}>
            <List
              source={orderReturnBundleGoods}
              getKey={(item) => `${item.id}`}
              render={(bundleGoods) => (
                <OrderGoods
                  {...bundleGoods}
                  selectable
                  onChange={() =>
                    exportId &&
                    handleChangeBundleGoods({
                      itemOptionId: bundleGoods.id,
                      itemId: bundleGoods.itemId,
                      exportId: Number(exportId),
                    })
                  }
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
                  claimType: ClaimTypes.RETURN_REQUEST,
                  processType: ProcessTypes.REASON,
                  appLinkParams: { landingType: 'push', rootNavigation: false },
                  initialData: {
                    itemInfoList: [
                      {
                        itemId: orderReturnTargetGoods.itemId,
                        itemOptionId: orderReturnTargetGoods.id,
                        exportId: Number(exportId),
                      },
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
      {/* 반품 사유 선택 */}
      {processType === ProcessTypes.REASON && (
        <>
          <ReturnReason
            reasonCode={reasonCode}
            reasons={reasonItems}
            sellerCause={sellerCause}
            reasonError={sellerCauseError}
            causeCode={causeCode}
            causeName={causeName}
            estimatedReturnShippingCost={estimatedReturnShippingCost}
            onChangeReturnReason={handleChangeReasonCode}
            onChangeDetailCause={handleChangeDetailCause}
            attachments={attachments}
            isLoadingReturnShippingCost={isLoadingReturnShippingCost}
            onUploadDetailReasonFile={handleUploadFiles}
            onDeleteDetailReasonFile={handleDeleteFile}
            claimType="RETURN"
          />
          <FloatingButtonWrapperStyled>
            <Button
              block
              bold
              size="large"
              variant="primary"
              disabled={!isValid || isLoadingUploadFile}
              onClick={() => {
                isValid &&
                  handleNavigate({
                    orderId: Number(orderId),
                    claimType: ClaimTypes.RETURN_REQUEST,
                    processType: ProcessTypes.RECALL,
                    appLinkParams: { landingType: 'push', rootNavigation: false },
                    initialData: {
                      reasonCode,
                      ...(sellerCause && { reason: sellerCause }),
                      ...(attachments.length > 0 && { fileIdList: attachments.map((data) => data.fileId) }),
                    },
                  });
              }}
            >
              다음
            </Button>
          </FloatingButtonWrapperStyled>
        </>
      )}
      {/* 반품 방법 선택 */}
      {processType === ProcessTypes.RECALL && (
        <>
          <RecallMethod
            returnMethod={selectedReturnMethod}
            methods={returnMethodList}
            senderInfo={returnSenderInfo}
            handleChangeReturnMethod={handleChangeReturnMethod}
          />
          <FloatingButtonWrapperStyled>
            <Button
              block
              bold
              size="large"
              variant="primary"
              disabled={!isReturnMethodValid}
              onClick={() => {
                isReturnMethodValid &&
                  handleNavigate({
                    orderId: Number(orderId),
                    claimType: ClaimTypes.RETURN_REQUEST,
                    processType: ProcessTypes.CONFIRM,
                    appLinkParams: { landingType: 'push', rootNavigation: false },
                    initialData: { returnMethod: selectedReturnMethod },
                  });
              }}
            >
              다음
            </Button>
          </FloatingButtonWrapperStyled>
        </>
      )}
      {/* 반품 요청 내역 */}
      {processType === ProcessTypes.CONFIRM && (
        <Section>
          <List className="claim-goods-list" source={orderReturnGoods} component={OrderGoods} />
        </Section>
      )}
      {processType === ProcessTypes.CONFIRM && returnReasonItem && refundInfo && returnMethod && (
        <SectionDetailStyled>
          <ClaimDetailInfo
            claimReasonItem={returnReasonItem}
            shippingCost={refundInfo.shippingAmount}
            claimMethod={returnMethod}
            claimSender={returnSender}
          />
        </SectionDetailStyled>
      )}
      {/* 환불 정보 */}
      {processType === ProcessTypes.CONFIRM && refundInfo && (
        <SectionDetailStyled>
          <EstimatedRefundInfo {...refundInfo} showReturnShipppingAmount />
        </SectionDetailStyled>
      )}
      {processType === ProcessTypes.CONFIRM && (
        /* 반품 요청 버튼 */
        <FloatingButtonWrapperStyled>
          <Button block bold loading={isOrderReturning} size="large" variant="primary" onClick={handleOrderReturn}>
            {ClaimManageInfo.RETURN_REQUEST.process?.[processType]}
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

  .claim-goods-list {
    padding-bottom: ${({ theme }) => `${theme.spacing.s12}`};
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

const CollapseSectionStyled = styled(CollapseSection)`
  .title {
    font: ${({ theme }) => theme.fontType.mediumB};
    color: ${({ theme }) => theme.color.text.textPrimary};
  }
`;

const SectionDetailStyled = styled(Section)`
  padding-top: ${({ theme }) => `${theme.spacing.s12}`};
  background: ${({ theme }) => theme.color.backgroundLayout.section};
`;
