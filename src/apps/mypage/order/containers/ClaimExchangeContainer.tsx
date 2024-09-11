import { useEffect } from 'react';
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
import { Divider } from '@pui/divider';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { phoneNumberToString } from '@features/delivery/utils';
import {
  useClaimExchangeService,
  useClaimReturnMethodService,
  useClaimReturnReasonService,
  useClaimUploadService,
} from '../services';
import {
  Main,
  Section,
  OrderGoods,
  ReturnReason,
  ClaimDetailInfo,
  ShippingInfo,
  ClaimExchangeOptionList,
  OrderClaimInfo,
} from '../components';
import { useClaimNavigate } from '../hooks';
import { ClaimManageInfo, ClaimTypes, ExchangeInfoText, ProcessTypes, ProcessTypeInfo } from '../constants';
import { CollapseSection } from '../components/CollapseSection';
import { RecallMethod } from '../components/ReCallMethod';

interface UrlParams {
  orderId: string;
  processType: ProcessTypeInfo;
}

interface QueryParams {
  itemId?: string;
  itemOptionId?: string;
  exportId?: string;
  hasBundle?: string;
}

export const ClaimExchangeContainer = () => {
  // URL Parameter
  const { orderId, processType } = useParams<UrlParams>();
  const { itemId, itemOptionId, exportId, hasBundle } = useQueryString<QueryParams>();
  const { toLink, getLink } = useLink();
  const { handleNavigate, handleDismissConfirm } = useClaimNavigate();
  const { setTopBar } = useWebInterface();
  const { isIOS, isApp } = useDeviceDetect();

  const {
    exchangeDetailQuery,
    exchangeBundleQuery,
    selectedBundleGoods,
    isOrderExchanging,
    handleOrderExchange,
    handleChangeBundleGoods,
    itemInfoList,
    updatedShippingInfo,
    showChangeShippingAddressModal,
    handleSelectExchangeOption,
    handleResetSelectOption,
    handleAllowedNavigation,
    selectedTargetOption,
    selectedBundleOptionList,
  } = useClaimExchangeService({
    orderId,
    itemId,
    itemOptionId,
    exportId,
    processType,
    hasBundle,
  });
  const {
    data: exchangeDetailData,
    error: exchangeDetailError,
    isError: isExchangeDetailError,
    isLoading: isExchangeDetailLoading,
  } = exchangeDetailQuery;

  const {
    data: exchangeBundleData,
    error: exchangeBundleError,
    isError: isExchangeBundleError,
    isLoading: isExchangeBundleLoading,
  } = exchangeBundleQuery;

  const { orderExchangeGoods, refundInfo, returnSender, exchangeMethod, recipient, exchangeReasonItem } =
    exchangeDetailData || {};

  const { orderExchangeTargetGoods, orderExchangeBundleGoods } = exchangeBundleData || {};

  const { goodsOptionTitleList, goodsOptionItemList } = orderExchangeTargetGoods || {};

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
    isErrorReturnShippingCost,
    returnShippingCostError,
  } = useClaimReturnReasonService({ orderId, processType, itemInfoList, claimType: ClaimTypes.EXCHANGE_REQUEST });

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
    claimType: 'exchange',
  });

  const { attachments, handleUploadFiles, handleDeleteFile, isLoadingUploadFile } = useClaimUploadService();

  const { exchangeMethodList, returnSenderInfo } = returnMethodItems || {};

  const goToOrderHistory = () => {
    toLink(getLink(UniversalLinkTypes.ORDER_HISTORY));
  };

  /**
   * 묶음 교환 화면 내 다음 버튼 disabled 조건
   * 기준 상품은 옵션을 가지고 있는데 선택 옵션이 없는 경우
   * 묶음 상품은 체크한 옵션이 있는 상품 수량과 옵션 선택 완료 상품 수량 다른 경우
   */
  const isDisabledExchangeBundle =
    (goodsOptionTitleList && goodsOptionTitleList.length > 0 && !selectedTargetOption) ||
    (selectedBundleGoods.length > 0 &&
      selectedBundleGoods.filter((data) => data.isMultiOption).length !== selectedBundleOptionList.length);

  useEffect(() => {
    isOrderExchanging && handleAllowedNavigation(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOrderExchanging]);

  const loading = useLoadingSpinner(
    isExchangeDetailLoading || isExchangeBundleLoading || isReasonItemsLoading || isReturnMethodItemsLoading,
  );

  useEffect(() => {
    handleDismissConfirm({
      title: ExchangeInfoText.DISMISS_TITLE,
    });
    if (isApp) {
      setTopBar({
        title: ClaimManageInfo.EXCHANGE_REQUEST.process?.[processType] || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApp, processType]);

  useHeaderDispatch({
    type: 'mweb',
    title: ClaimManageInfo.EXCHANGE_REQUEST.process?.[processType],
    quickMenus: ['cart', 'menu'],
    enabled: !isExchangeDetailLoading && !isExchangeBundleLoading && !isReasonItemsLoading,
  });

  if (loading) {
    return null;
  }

  if (
    isExchangeDetailError ||
    isExchangeBundleError ||
    isReasonItemsError ||
    isReturnMethodItemsError ||
    isErrorReturnShippingCost
  ) {
    return (
      <PageError
        isFull
        error={
          exchangeDetailError ||
          exchangeBundleError ||
          reasonItemsError ||
          returnShippingCostError ||
          returnMethodItemsError
        }
        actionLabel="주문 목록으로 이동"
        onAction={goToOrderHistory}
      />
    );
  }

  return (
    <MainStyled className={isIOS && isApp ? 'is-ios-app' : ''}>
      {!isApp && <TitleSection title={ClaimManageInfo.EXCHANGE_REQUEST.process?.[processType]} />}
      {/* 묶음 교환 가능한 상품 */}
      {processType === ProcessTypes.BUNDLE && orderExchangeTargetGoods && orderExchangeBundleGoods && (
        <>
          <OrderGoodsWrapper>
            <OrderGoods {...orderExchangeTargetGoods} />
          </OrderGoodsWrapper>
          {goodsOptionTitleList && goodsOptionTitleList.length > 0 && goodsOptionItemList && (
            <ClaimExchangeOptionList
              itemOptionId={orderExchangeTargetGoods.id}
              goodsPrice={orderExchangeTargetGoods.price}
              titleList={goodsOptionTitleList}
              itemList={goodsOptionItemList}
              isTargetOption
              onSelectOption={handleSelectExchangeOption}
              onResetOption={handleResetSelectOption}
            />
          )}
          {orderExchangeBundleGoods.length > 0 && (
            <>
              <Divider />
              <CollapseSectionStyled title="함께 교환 가능한 상품" defaultExpanded={false}>
                <List
                  source={orderExchangeBundleGoods}
                  getKey={(item) => `${item.id}_${item.itemId}`}
                  render={(bundleGoods) => {
                    const showGoodsOptionList = selectedBundleGoods.some(
                      (goods) => goods.itemOptionId === bundleGoods.id,
                    );
                    return (
                      <>
                        <OrderGoodsWrapper>
                          <OrderGoods
                            {...bundleGoods}
                            selectable
                            onChange={() => {
                              exportId &&
                                handleChangeBundleGoods({
                                  itemOptionId: bundleGoods.id,
                                  itemId: bundleGoods.itemId,
                                  exportId: Number(exportId),
                                  goodsOptionId:
                                    (bundleGoods.goodsOptionTitleList.length === 0 &&
                                      bundleGoods.goodsOptionItemList[0].optionData?.id) ||
                                    undefined,
                                  isMultiOption: bundleGoods.goodsOptionTitleList.length > 0,
                                });
                            }}
                          />
                        </OrderGoodsWrapper>
                        {showGoodsOptionList &&
                          bundleGoods.goodsOptionTitleList &&
                          bundleGoods.goodsOptionTitleList.length > 0 &&
                          bundleGoods.goodsOptionItemList && (
                            <ClaimExchangeOptionList
                              itemOptionId={bundleGoods.id}
                              goodsPrice={bundleGoods.price}
                              titleList={bundleGoods.goodsOptionTitleList}
                              itemList={bundleGoods.goodsOptionItemList}
                              onSelectOption={handleSelectExchangeOption}
                              onResetOption={handleResetSelectOption}
                            />
                          )}
                      </>
                    );
                  }}
                />
              </CollapseSectionStyled>
            </>
          )}
          <FloatingButtonWrapperStyled>
            <Button
              block
              bold
              size="large"
              variant="primary"
              disabled={isDisabledExchangeBundle}
              onClick={() => {
                const mergedBundleGoods = selectedBundleGoods?.map((data) => {
                  const { exportId: bundleExportId, itemId: bundleItemId, itemOptionId: bundleItemOptionId } = data;
                  const isCompletedOption =
                    selectedBundleOptionList.length > 0 &&
                    selectedBundleOptionList.some((goods) => goods.itemOptionId === data.itemOptionId);
                  return {
                    exportId: bundleExportId,
                    itemId: bundleItemId,
                    itemOptionId: bundleItemOptionId,
                    goodsOptionId: isCompletedOption
                      ? selectedBundleOptionList.find((item) => item.itemOptionId === data.itemOptionId)?.id
                      : data.goodsOptionId,
                  };
                });
                handleNavigate({
                  orderId: Number(orderId),
                  claimType: ClaimTypes.EXCHANGE_REQUEST,
                  processType: ProcessTypes.REASON,
                  appLinkParams: { landingType: 'push', rootNavigation: false },
                  initialData: {
                    itemInfoList: [
                      {
                        itemId: orderExchangeTargetGoods.itemId,
                        itemOptionId: orderExchangeTargetGoods.id,
                        exportId: Number(exportId),
                        goodsOptionId: selectedTargetOption
                          ? selectedTargetOption.id
                          : orderExchangeTargetGoods.goodsOptionItemList[0].optionData?.id,
                      },
                      ...mergedBundleGoods,
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
      {/* 교환 사유 선택 */}
      {processType === ProcessTypes.REASON && (
        <>
          <ReturnReason
            reasonCode={reasonCode}
            reasons={reasonItems}
            reasonError={sellerCauseError}
            sellerCause={sellerCause}
            causeCode={causeCode}
            causeName={causeName}
            estimatedReturnShippingCost={estimatedReturnShippingCost}
            onChangeReturnReason={handleChangeReasonCode}
            onChangeDetailCause={handleChangeDetailCause}
            isLoadingReturnShippingCost={isLoadingReturnShippingCost}
            detailInfoTitle="예상 교환 비용"
            attachments={attachments}
            onUploadDetailReasonFile={handleUploadFiles}
            onDeleteDetailReasonFile={handleDeleteFile}
            claimType="EXCHANGE"
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
                    claimType: ClaimTypes.EXCHANGE_REQUEST,
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
      {/* 교환 방법 선택 */}
      {processType === ProcessTypes.RECALL && (
        <>
          <RecallMethod
            returnMethod={selectedReturnMethod}
            methods={exchangeMethodList}
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
                    claimType: ClaimTypes.EXCHANGE_REQUEST,
                    processType: ProcessTypes.CONFIRM,
                    appLinkParams: { landingType: 'push', rootNavigation: false },
                    initialData: { exchangeMethod: selectedReturnMethod },
                  });
              }}
            >
              다음
            </Button>
          </FloatingButtonWrapperStyled>
        </>
      )}
      {/* 교환 요청 내역 */}
      {processType === ProcessTypes.CONFIRM && exchangeReasonItem && (
        <Section>
          <List
            className="claim-goods-list"
            source={orderExchangeGoods}
            getKey={(item) => `${item.id}_${item.itemId}`}
            render={(data) => (
              <>
                <OrderGoods {...data} />
                {data.isExchangeOptions && (
                  <OrderClaimInfoStyled
                    type={data.type}
                    exchangeOptions={data.exchangeOptions}
                    reason={exchangeReasonItem?.text}
                  />
                )}
              </>
            )}
          />
        </Section>
      )}
      {processType === ProcessTypes.CONFIRM && exchangeReasonItem && refundInfo && exchangeMethod && (
        <SectionDetailStyled>
          <ClaimDetailInfo
            claimReasonItem={exchangeReasonItem}
            shippingCost={refundInfo.shippingAmount}
            claimMethod={exchangeMethod}
            claimSender={returnSender}
            claimType="EXCHANGE"
          />
        </SectionDetailStyled>
      )}
      {/* 배송지  */}
      {processType === ProcessTypes.CONFIRM && recipient && (
        <SectionDetailStyled>
          <ShippingInfo
            name={updatedShippingInfo ? updatedShippingInfo.name : recipient.name}
            address={
              updatedShippingInfo
                ? `${updatedShippingInfo.address} ${updatedShippingInfo.addressDetail}`
                : `${recipient.address} ${recipient.addressDetail}`
            }
            phoneNumber={phoneNumberToString(updatedShippingInfo ? updatedShippingInfo.phone : recipient.phone)}
            memo={recipient.deliveryRequestMessage}
            isChangeShippingAddress
            isCollapseSection={false}
            onClickChangeShippingAddress={showChangeShippingAddressModal}
          />
        </SectionDetailStyled>
      )}
      {processType === ProcessTypes.CONFIRM && (
        /* 교환 요청 버튼 */
        <FloatingButtonWrapperStyled>
          <Button block bold loading={isOrderExchanging} size="large" variant="primary" onClick={handleOrderExchange}>
            {ClaimManageInfo.EXCHANGE_REQUEST.process?.[processType]}
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
  padding: ${({ theme }) => `${theme.spacing.s16} ${theme.spacing.s24} 0 ${theme.spacing.s24}`};
  z-index: 1;
  ${Button} {
    width: 100%;
  }
`;

const CollapseSectionStyled = styled(CollapseSection)`
  margin-bottom: 5.6rem;
  .title {
    font: ${({ theme }) => theme.fontType.mediumB};
    color: ${({ theme }) => theme.color.text.textPrimary};
  }
`;

const OrderGoodsWrapper = styled.div`
  padding-bottom: ${({ theme }) => `${theme.spacing.s12}`};
`;

const SectionDetailStyled = styled(Section)`
  padding-top: ${({ theme }) => `${theme.spacing.s12}`};
  background: ${({ theme }) => theme.color.backgroundLayout.section};
`;

const OrderClaimInfoStyled = styled(OrderClaimInfo)`
  margin: ${({ theme }) => `0 ${theme.spacing.s24} ${theme.spacing.s12} ${theme.spacing.s24}`};
`;
