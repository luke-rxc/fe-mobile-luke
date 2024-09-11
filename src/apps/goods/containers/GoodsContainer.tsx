import React, { useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from '@hooks/useTheme';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { Divider } from '@pui/divider';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { EventBannerList } from '@pui/eventBanner';
import { GeoMapLocation } from '@features/map/components';
import { GoodsKind, GoodsType } from '@constants/goods';
import {
  GoodsMetaInfo,
  Header,
  GoodsContent,
  GoodsCover,
  GoodsShowroom,
  GoodsBrandTitle,
  GoodsCta,
  GoodsCoupon,
  GoodsPrice,
  GoodsGuide,
  GoodsShippingInfo,
  GoodsTicketInfo,
  GoodsFooter,
  GoodsError,
  GoodsListItem,
  GoodsReviewShortcut,
  GoodsBenefitPayment,
  GoodsDescription,
  ContentsSubWrapper,
  GoodsFeedList,
  GoodsSalesScheduler,
  GoodsTicketCancelInfo,
} from '../components';
import { useGoodsService } from '../services';
import { FeedType, GoodsSalesSchedulerType, PageLoadStatus } from '../constants';
import { GoodsOptionContainer } from './GoodsOptionContainer';
import { useGoodsPageInfo } from '../hooks';

export const GoodsContainer: React.FC = () => {
  const { theme } = useTheme();
  const { isApp } = useDeviceDetect();
  const { isInLivePage } = useGoodsPageInfo();
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  /** Service: 기본 Goods Service */
  const {
    /** init Status */
    pageLoadState,

    /** Goods Base Info */
    goodsId,
    detailGoods,
    showRoom,
    header,
    bannerList,
    isAuctionType,
    isOndaDeal,
    goodsError,

    /** Pricing Table */
    hasPriceList,
    handlePriceListOpen,

    /** Showroom */
    isShowroomActive,
    handleShowroomProfileClick,

    /** Deals */
    deals,
    hasMoreDeals,
    isDealsFetching,
    handleLoadDeals,

    /** Content */
    contentsList,
    isAbleContentPage,
    hasContentList,

    /** Review */
    reviewShortcutList,
    hasReviewShortcutList,
    reviewList,
    hasReviewList,
    isAbleReviewPage,
    reviewListLink,

    /** Recommendation */
    isRecommendationShow,
    recommendation,
    isAbleRecommendationPage,
    recommendationLink,

    /** Coupon */
    coupon,
    isUserCouponDownloaded,
    isCouponActive,
    handleCouponDownload,
    handleCouponLink,

    /** Wish */
    hasWishItem,
    handleUpdateWish,

    /** Option */
    option,
    isCloseConfirm,
    sendWebOptionData,
    isOptionOpen,
    isOptionDrawerOpen,
    handleOptionOpen,
    handleOptionCloseWithDeleteExpired,
    handleOptionClose,
    handleOptionCloseComplete,
    handleActionSave,
    handleDeleteExpired,

    /** SalesScheduler */
    salesSchedulerType,
    enabledCountDown,
    isStatusChange,
    salesStart,
    salesEnd,
    ddayProps,
    purchasableEa,

    /** Notification */
    isNotification,
    handleUpdateNotification,

    /** Cta */
    isCtaBuyable,
    isCtaStatusText,
    isStatusWait,

    /** Log */
    logService,

    /** Display */
    isShippingInfoActive,
    isTicketInfoActive,
    isDescriptionActive,
    hasEventBannerList,

    /** Etc */
    handleQnaLink,
  } = useGoodsService();

  /** Rendering: loading */
  if (pageLoadState === PageLoadStatus.LOADING) {
    return null;
  }

  /** Rendering: error */
  if (pageLoadState === PageLoadStatus.ERROR || !detailGoods || !option) {
    return <GoodsError error={goodsError} />;
  }

  /** Rendering: Base */
  const {
    name,
    shipping,
    benefitPayment,
    description,
    benefitDescription,
    brand,
    isWishAble,
    headers,
    type,
    status,
    auction,
    kind,
    ticket,
    benefits,
    isExistComponent,
    isExistDetailInformation,
    isCartAddable,
    code,
    accom,
  } = detailGoods;
  const { tagType } = benefits;
  const { defaultOption, totalStock } = option;
  // 수량 제한 여부
  const { isInfinity } = totalStock;

  /** Log Methods */
  const {
    logTabBanner: handleLogTabBanner,
    logTabContentsMore: handleLogTabContentsMore,
    logTabContentsThumbnail: handleLogTabContentsThumbnail,
    logTabReviewShortcut: handleLogTabReviewShortcut,
    logTabReviewMore: handleLogTabReviewMore,
    logImpressionReview: handleLogImpressionReview,
    logTabReviewThumbnail: handleLogTabReviewThumbnail,
    logImpressionSectionGoods: handleLogImpressionSection,
    logImpressionSectionGoodsThumbnail: handleLogImpressionSectionThumbnail,
    logTabSectionGoodsThumbnail: handleLogTabSectionThumbnail,
    logTabSectionMore: handleLogTabSectionMore,
    logCoverSwiper: handleLogCoverSwiper,
    logShowroomTabOnTop: handleLogShowroomTabOnTop,
    logTabGoodsInShowroom: handleLogTabGoodsInShowroom,
    logTabContent: handleLogTabContent,
    logTabDetailInfo: handleLogTabDetailInfo,
    logTabRefundInfo: handleLogTabRefundInfo,
    logTabProviderInfo: handleLogTabProviderInfo,
    logTabTicketProviderInfo: handleLogTabTicketProviderInfo,
    logShowroomTabOnTopBar: handleLogShowroomTabOnTopBar,
    logTabBenefitMore: handleLogTabBenefitMore,
    logTabCancelPolicyMore: handleLogTabCancelPolicyMore,
    logTabDescriptionMore: handleLogTabDescriptionMore,
    logTabCodeCopy: handleLogTabCodeCopy,
    logSwipeTagInfo: handleLogSwiperTagInfo,
    logTabMap: handleLogTabMap,
    logTabAddressCopy: handleLogTabAddressCopy,
    logTabOption: handleLogTabOption,
    logTabDeleteOptionBlock: handleLogTabDeleteOptionBlock,
    logTabReselectConfirm: handleLogTabReselectConfirm,
    logImpressionTimeoutConfirm: handleLogImpressionTimeoutConfirm,
  } = logService;

  return (
    <>
      <GoodsMetaInfo detailGoods={detailGoods} />
      {header && (
        <Header
          transitionTrigger={contentWrapperRef}
          goodsImagePath={sendWebOptionData?.primaryImage.path}
          onClickTitle={handleLogShowroomTabOnTopBar}
          {...header}
        />
      )}
      <Wrapper>
        <GoodsCover headers={headers} tagType={tagType} onIndexChange={handleLogCoverSwiper} />
        <ContentsWrapper className={`${isApp && 'in-app'}`} ref={contentWrapperRef}>
          {!!salesSchedulerType && (
            <GoodsSalesScheduler
              salesStartDate={salesStart}
              salesEndDate={salesEnd}
              enabledCountDown={enabledCountDown}
              ddayProps={ddayProps}
              status={status}
              isPreorder={type === GoodsType.PREORDER}
              isPreorderChange={isStatusChange === GoodsSalesSchedulerType.PREORER}
              isInfinity={isInfinity}
              purchasableEa={purchasableEa}
            />
          )}

          <ContentsSubWrapper salesSchedulerType={salesSchedulerType} isInfinity={isInfinity}>
            <ContentSection>
              {/* Section Inner */}
              <div className="inner-area">
                <div className="brand-title-wrapper">
                  {brand && <GoodsBrandTitle brand={brand} onClick={handleLogShowroomTabOnTop} />}
                  {hasReviewShortcutList && (
                    <GoodsReviewShortcut
                      goodsId={goodsId}
                      reviewShortcutList={reviewShortcutList}
                      sectionLink={reviewListLink}
                      onClick={handleLogTabReviewShortcut}
                    />
                  )}
                </div>
                <div className="base-info">
                  <p className="goods-name">{name}</p>
                  <GoodsPrice
                    type={type}
                    status={status}
                    defaultOption={defaultOption}
                    auction={auction}
                    hasPriceList={hasPriceList}
                    onPriceListOpen={handlePriceListOpen}
                  />
                </div>

                <Divider className="no-padding" />
                {/* 쿠폰이 있고 경매타입이 아닐때 노출 */}
                {isCouponActive && (
                  <GoodsCoupon
                    coupon={coupon}
                    isUserDownloaded={isUserCouponDownloaded}
                    onCouponDownload={handleCouponDownload}
                    onCouponLink={handleCouponLink}
                  />
                )}

                <div className="spacing" />
              </div>

              {benefitPayment && (
                <GoodsGuide header="혜택" smallVerticalPadding>
                  <GoodsBenefitPayment benefitPayment={benefitPayment} onExpandView={handleLogTabBenefitMore} />
                </GoodsGuide>
              )}

              {isShippingInfoActive && (
                <GoodsGuide header="배송">
                  <GoodsShippingInfo shippingInfo={shipping} />
                </GoodsGuide>
              )}

              {isTicketInfoActive && ticket && (
                <GoodsGuide header={ticket.usablePeriodTitle}>
                  <GoodsTicketInfo ticketInfo={ticket} />
                </GoodsGuide>
              )}

              {isDescriptionActive && (
                <GoodsGuide header="상품 설명" disabledHorizontalPadding smallVerticalPadding>
                  <GoodsDescription
                    goodsId={goodsId}
                    benefitDescription={benefitDescription}
                    accom={accom}
                    description={description}
                    code={code}
                    isOndaDeal={isOndaDeal}
                    isDetailView={isExistComponent}
                    isDetailInfoView={isExistDetailInformation}
                    onScrollAccomInfo={handleLogSwiperTagInfo}
                    onExpandView={handleLogTabDescriptionMore}
                    onClickCode={handleLogTabCodeCopy}
                    onContentClick={handleLogTabContent}
                    onDetailInfoClick={handleLogTabDetailInfo}
                  />
                </GoodsGuide>
              )}

              {ticket?.place && (
                <GoodsGuide header="위치" disabledHorizontalPadding smallVerticalPadding>
                  <GeoMapLocation
                    place={ticket.place}
                    onClickMap={handleLogTabMap}
                    onClickCopy={handleLogTabAddressCopy}
                  />
                </GoodsGuide>
              )}

              {isTicketInfoActive && ticket && (
                <GoodsGuide header="취소·환불 안내">
                  <GoodsTicketCancelInfo ticketInfo={ticket} onExpandView={handleLogTabCancelPolicyMore} />
                </GoodsGuide>
              )}

              {hasContentList && (
                <GoodsContent
                  isAbleContentPage={isAbleContentPage}
                  contentsList={contentsList}
                  showroomId={showRoom?.id ?? null}
                  onListTitleClick={handleLogTabContentsMore}
                  onListClick={handleLogTabContentsThumbnail}
                />
              )}

              {hasReviewList && (
                <GoodsReviewList
                  goodsId={goodsId}
                  type={FeedType.REVIEW}
                  title="리뷰"
                  isMore={isAbleReviewPage}
                  source={reviewList}
                  sectionLink={reviewListLink}
                  onClickMoreView={handleLogTabReviewMore}
                  onVisibilityList={handleLogImpressionReview}
                  onClick={handleLogTabReviewThumbnail}
                />
              )}
            </ContentSection>

            <Divider />

            {hasEventBannerList && <EventBannerList list={bannerList ?? []} onClick={handleLogTabBanner} />}

            <ContentInfo>
              <GoodsListItem
                goodsId={goodsId}
                isInfoView={!isAuctionType}
                isQnaView={!isInLivePage}
                isGoodsKindTicket={kind !== GoodsKind.REAL}
                onQnaClick={handleQnaLink}
                onCsClick={handleLogTabRefundInfo}
                onInfoClick={handleLogTabProviderInfo}
                onInfoTicketClick={handleLogTabTicketProviderInfo}
              />
            </ContentInfo>

            {isRecommendationShow && recommendation && (
              <ContentCardList>
                <Divider type="section" />
                <GoodsFeedList
                  goodsId={goodsId}
                  type={FeedType.GOODS}
                  title={recommendation.title}
                  isMore={isAbleRecommendationPage}
                  source={recommendation.source}
                  sectionLink={recommendationLink}
                  onClickMoreView={handleLogTabSectionMore}
                  onVisibilityList={handleLogImpressionSection}
                  onVisibilityItem={handleLogImpressionSectionThumbnail}
                  onClick={handleLogTabSectionThumbnail}
                />
              </ContentCardList>
            )}

            {isShowroomActive && (
              <>
                <Divider type="section" />
                <ContentBrand>
                  <GoodsShowroom
                    showRoom={showRoom}
                    theme={theme}
                    deals={deals}
                    hasMoreDeals={hasMoreDeals}
                    isDealsFetching={isDealsFetching}
                    onLoadDeals={handleLoadDeals}
                    onProfileIconClick={handleShowroomProfileClick}
                    onDealsListClick={handleLogTabGoodsInShowroom}
                  />
                </ContentBrand>
              </>
            )}

            <ContentFooter>
              <GoodsFooter />
            </ContentFooter>
          </ContentsSubWrapper>
        </ContentsWrapper>

        <GoodsCta
          isBuyAble={isCtaBuyable}
          isWishAble={isWishAble}
          statusText={isCtaStatusText}
          hasWishItem={hasWishItem}
          isStatusWait={isStatusWait}
          isNotification={isNotification}
          onUpdateWish={handleUpdateWish}
          onUpdateNotification={handleUpdateNotification}
          onOptionOpen={handleOptionOpen}
        />

        {/** Mweb Only */}
        {!isApp && isOptionOpen && (
          <Drawer
            dragging
            expandView
            to="-38%"
            snapTopPercent={85}
            backDropProps={{ disableBackDropClose: isCloseConfirm }}
            draggingProps={{
              closeConfirm: {
                title: '선택하지 않고 나갈까요?',
                message: '내용은 저장되지 않습니다',
                disableForceClose: true,
                condition: isCloseConfirm,
                cb: () => {
                  handleOptionCloseWithDeleteExpired();
                },
              },
            }}
            dragHandleHeight="5.6rem"
            open={isOptionDrawerOpen}
            onClose={handleOptionClose}
            onCloseComplete={handleOptionCloseComplete}
          >
            <GoodsOptionContainer
              isOpen={isOptionDrawerOpen}
              isCartAddable={isCartAddable}
              optionData={sendWebOptionData}
              onActionSave={handleActionSave}
              onDeleteExpired={handleDeleteExpired}
              onLogTabOption={handleLogTabOption}
              onLogTabDeleteOptionBlock={handleLogTabDeleteOptionBlock}
              onLogTabReselectConfirm={handleLogTabReselectConfirm}
              onLogImpressionTimeoutConfirm={handleLogImpressionTimeoutConfirm}
            />
          </Drawer>
        )}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.section`
  transform: translate3d(0, 0, 0);

  & .no-padding {
    padding: 0;
  }
`;

const ContentsWrapper = styled.div`
  position: relative;
  width: 100vw;
  background: ${({ theme }) => theme.color.background.surface};
  z-index: 1;

  /* inApp 기본 페이지, 라이브 페이지 경우 해당 영역에 safe-area 적용 */
  &.in-app {
    ${({ theme }) => theme.mixin.safeArea('padding-bottom')};
  }

  ${EventBannerList} {
    padding: ${({ theme }) => `${theme.spacing.s8} ${theme.spacing.s24} ${theme.spacing.s12}`};
  }
`;

const ContentSection = styled.div`
  & .inner-area {
    padding: 0 ${({ theme }) => theme.spacing.s24};
    background: ${({ theme }) => theme.color.background.surface};

    & .brand-title-wrapper {
      display: flex;
      padding-top: 1.2rem;
    }

    & .base-info {
      padding: ${({ theme }) => `${theme.spacing.s12} 0`};
      & .goods-name {
        color: ${({ theme }) => theme.color.black};
        font: ${({ theme }) => theme.fontType.large};
        word-break: break-all;
        overflow-wrap: break-word;
      }
    }

    & .cta-wrapper {
      padding: ${({ theme }) => `${theme.spacing.s24} 0`};
    }

    .spacing {
      padding-bottom: ${({ theme }) => theme.spacing.s12};
    }
  }
`;

const GoodsReviewList = styled(GoodsFeedList)`
  padding-bottom: ${({ theme }) => theme.spacing.s32};
`;

// ========================================================
const ContentInfo = styled.div`
  padding: ${({ theme }) => `${theme.spacing.s12} 0`};
`;

// =======================================================
const ContentBrand = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.s24};
`;

const ContentCardList = styled.div`
  > div + div {
    margin-top: ${({ theme }) => theme.spacing.s12};
  }
`;

const ContentFooter = styled.div`
  padding: ${({ theme }) => `${theme.spacing.s24} ${theme.spacing.s24} ${theme.spacing.s24} ${theme.spacing.s24}`};
  /**
   * floating CTA에 의해 Footer가 가려지지 않게 하기위해서 마진값 추가
   * CTA(64px) + floatingPadding(24px) + floating 전체 영역 하단 마진 (4px)
   */
  margin-bottom: 9.2rem;
`;
// =========================================================
