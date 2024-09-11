import { useMemo } from 'react';
import styled from 'styled-components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { NotFound, PageError } from '@features/exception/components';
import { TitleSection } from '@pui/titleSection';
import { ButtonText } from '@pui/buttonText';
import {
  useLiveCouponService,
  useLiveEndLogService,
  useLiveEndService,
  useLiveEndUserActionService,
  useLiveScheduleService,
} from '../services';
import { useUser } from '../hooks';
import {
  LiveCouponList,
  LiveEndHeader,
  LiveEndSectionStyled,
  LiveLoading,
  ScheduleItems,
  LiveGoodsCardList,
  LiveEndCta,
} from '../components';

interface Props {
  liveId: number;
}

export const LiveEndContainer = ({ liveId }: Props) => {
  const logService = useLiveEndLogService();
  const { userInfo, handleLogin } = useUser();

  const {
    liveInfo,
    errorInfo,
    hasDownloadableCoupon,
    showroom,
    showroomProps: { handleClickShowroom },
    isError,
    isNotEnded,
    isLoading,
    goodsListProps,
    goodsMoreProps,
  } = useLiveEndService({
    liveId,
    logService,
  });

  const liveCouponServiceProps = useLiveCouponService({
    enabled: !isNotEnded,
    liveId,
    hasDownloadableCoupon,
    isOpenedGoodsDrawer: false,
    isLogin: !!userInfo,
    viewType: 'liveEnd',
    handleLogin,
    handleLogLiveImpressionCoupon: logService.logLiveImpressionEndpageCoupon,
    handleLogLiveTabCouponDownload: logService.logLiveTabEndpageCouponDownload,
    handleLogLiveCompleteCouponDownload: logService.logLiveCompleteEndpageCoupon,
  });

  const {
    scheduleItems,
    metaData,
    isLoading: isLoadingLiveSchedule,
    scheduleMoreLink,
    handleClickOpenContents,
    handleClickScheduleMore,
  } = useLiveScheduleService({
    type: 'liveEnd',
    liveId,
    enabled: !!liveInfo && !isNotEnded,
    sectionId: liveInfo?.sectionId,
    logService,
  });

  const { handleAction } = useLiveEndUserActionService();

  const goodsMoreElement = useMemo(
    () =>
      goodsMoreProps.goodsMoreLink && (
        <ButtonText
          is="a"
          link={goodsMoreProps.goodsMoreLink}
          onClick={goodsMoreProps.handleClickGoodsMore}
          children="더보기"
        />
      ),
    [goodsMoreProps.goodsMoreLink, goodsMoreProps.handleClickGoodsMore],
  );

  const scheduleMoreElement = useMemo(
    () =>
      scheduleMoreLink && (
        <ButtonText is="a" link={scheduleMoreLink} onClick={handleClickScheduleMore} children="더보기" />
      ),
    [scheduleMoreLink, handleClickScheduleMore],
  );

  useHeaderDispatch({
    type: 'mweb',
    title: showroom?.name,
    enabled: true,
    quickMenus: ['cart', 'menu'],
  });

  if (isNotEnded) {
    return <NotFound />;
  }

  if (isError) {
    return <PageError {...errorInfo} isFull />;
  }

  if (isLoading || isLoadingLiveSchedule) {
    return <LiveLoading />;
  }

  return (
    <>
      <LiveEndHeader />
      {(liveCouponServiceProps.couponList || []).length > 0 && (
        <LiveEndSectionStyled>
          <TitleSection title="쿠폰" />
          <LiveCouponList viewType="liveEnd" {...liveCouponServiceProps} showroom={showroom} />
        </LiveEndSectionStyled>
      )}
      {goodsListProps.goodsList.length > 0 && (
        <LiveEndSectionStyled>
          <TitleSection title="라이브 상품" suffix={goodsMoreElement} />
          <LiveGoodsCardList {...goodsListProps} />
        </LiveEndSectionStyled>
      )}
      {(scheduleItems || []).length > 0 && (
        <LiveEndSectionStyled>
          <TitleSection
            title={metaData?.title || ''}
            subtitle={metaData?.subTitle || ''}
            suffix={scheduleMoreElement}
          />
          <ScheduleItems
            items={scheduleItems}
            opened
            showMore={false}
            onClickUserAction={handleAction}
            onClickOpenContents={handleClickOpenContents}
          />
        </LiveEndSectionStyled>
      )}
      <LiveEndCta onClickShowroom={handleClickShowroom} />
      <BlankWrapperStyled />
    </>
  );
};

const BlankWrapperStyled = styled.div`
  width: 100%;
  height: 9.2rem;
`;
