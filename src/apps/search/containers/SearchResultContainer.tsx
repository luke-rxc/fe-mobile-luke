import { useEffect } from 'react';
import styled from 'styled-components';
import { UniversalLinkTypes } from '@constants/link';
import { List } from '@pui/list';
import { ButtonText } from '@pui/buttonText';
import { GoodsCardSmall } from '@pui/goodsCardSmall';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useLink } from '@hooks/useLink';
import { useLoading } from '@hooks/useLoading';
import { ContentCardSmall } from '@pui/contentCardSmall';
import { TitleSection } from '@pui/titleSection';
import { rn2br } from '@utils/string';
import { MoreLabel } from '@constants/ui';
import { SearchBar, SearchPageError, SearchBrandCard, SearchLiveCard } from '../components';
import { useSearchAutoCompleteService, useLogService, useSearchResultService } from '../services';

interface Props {
  query: string;
  className?: string;
}

export const SearchResultContainer = styled(({ query, className }: Props) => {
  const { showLoading, hideLoading } = useLoading();
  const { isApp } = useDeviceDetect();
  const { getLink } = useLink();

  // 검색 자동완성
  const { searchAutoComplete, handleClickBack, handleChangeSearchKeyword, handleSubmitSearchKeyword } =
    useSearchAutoCompleteService({ query });

  // 전체 검색결과
  const {
    data,
    error,
    isError,
    isLoading,
    isEmpty,
    handleClickBrandFollow,
    handleChangeBrandCardFollow,
    handleClickLiveFollow,
    handleChangeLiveCardFollow,
  } = useSearchResultService({ query });

  // 로그
  const { logTabInResultGoods, logTabInResultBrand, logTabInResultContent, logTabInResultSchedule } = useLogService();

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  /* eslint-disable no-nested-ternary */
  return (
    <div className={className}>
      {/* 모웹 검색바 */}
      {!isApp && (
        <SearchBar
          initQuery={query}
          onClickBack={handleClickBack}
          onChangeKeyword={handleChangeSearchKeyword}
          onSubmit={handleSubmitSearchKeyword}
          autoComplete={searchAutoComplete}
        />
      )}

      {isError ? (
        // Error
        <SearchPageError error={error} />
      ) : isEmpty ? (
        // Empty
        <SearchPageError description={rn2br('검색 결과가 없습니다\r\n다른 검색어를 입력해보세요')} />
      ) : (
        <>
          {/* Goods Section */}
          {!!data?.goods.length && (
            <>
              <TitleSection
                title="상품"
                suffix={
                  <ButtonText
                    is="a"
                    link={getLink(UniversalLinkTypes.SEARCH_GOODS_LIST, { query })}
                    children={MoreLabel}
                  />
                }
              />
              <List
                is="div"
                component={GoodsCardSmall}
                source={data.goods}
                getKey={({ goodsCode }) => goodsCode}
                getHandlers={({ 'data-log-goods-id': goodsId, goodsName }) => ({
                  onClick: () => {
                    logTabInResultGoods({ section: 'ALL', goodsId, goodsName });
                  },
                })}
              />
            </>
          )}

          {/* Showrooms Section */}
          {!!data?.brands.length && (
            <>
              <TitleSection
                title="쇼룸"
                suffix={
                  <ButtonText
                    is="a"
                    link={getLink(UniversalLinkTypes.SEARCH_SHOWROOM_LIST, { query })}
                    children={MoreLabel}
                  />
                }
              />
              <List
                is="div"
                component={SearchBrandCard}
                source={data.brands}
                getKey={({ showroomCode }) => `${showroomCode}`}
                getHandlers={({ 'data-log-showroom-id': showroomId, title: showroomName, onAir, liveId }) => ({
                  onClickFollow: handleClickBrandFollow,
                  onChangeFollow: handleChangeBrandCardFollow,
                  onClickShowroomLink: () => {
                    logTabInResultBrand({ section: 'ALL', showroomId, showroomName, onAir: !!onAir });
                  },
                  onClickLiveLink: () => {
                    logTabInResultBrand({ section: 'ALL', showroomId, showroomName, onAir: !!onAir, liveId });
                  },
                })}
              />
            </>
          )}

          {/* Content Section */}
          {!!data?.content.length && (
            <>
              <TitleSection
                title="콘텐츠"
                suffix={
                  <ButtonText
                    is="a"
                    link={getLink(UniversalLinkTypes.SEARCH_CONTENT_LIST, { query })}
                    children={MoreLabel}
                  />
                }
              />
              <List
                is="div"
                component={ContentCardSmall}
                source={data.content}
                getKey={({ contentCode }) => `${contentCode}`}
                getHandlers={({ 'data-log-content-id': contentId, title: contentName }) => ({
                  onClick: () => {
                    logTabInResultContent({ section: 'ALL', contentId, contentName });
                  },
                })}
              />
            </>
          )}

          {/* Live Section */}
          {!!data?.live.length && (
            <>
              <TitleSection
                title="라이브"
                suffix={
                  <ButtonText
                    is="a"
                    link={getLink(UniversalLinkTypes.SEARCH_SCHEDULE_LIVE_LIST, { query })}
                    children={MoreLabel}
                  />
                }
              />
              <List
                is="div"
                component={SearchLiveCard}
                source={data.live}
                getKey={({ scheduleId }, idx) => `${scheduleId ?? idx}`}
                getHandlers={({ scheduleId, title: scheduleName, onAir, liveId }) => ({
                  onClickFollow: handleClickLiveFollow,
                  onChangeFollow: handleChangeLiveCardFollow,
                  onClickLink: () => {
                    logTabInResultSchedule({
                      section: 'ALL',
                      scheduleId: `${scheduleId}`,
                      scheduleName,
                      onAir: !!onAir,
                      ...(onAir && liveId && { liveId }),
                    });
                  },
                })}
              />
            </>
          )}
        </>
      )}
    </div>
  );
  /* eslint-enable no-nested-ternary */
})`
  margin-bottom: 2.4rem;

  ${List} {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    overflow-x: auto;
    box-sizing: border-box;
    width: 100%;
    padding: 0 2.4rem;
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }

    ${GoodsCardSmall}, ${SearchBrandCard}, ${ContentCardSmall}, ${SearchLiveCard} {
      flex: 0 0 auto;
      margin-left: 1.6rem;

      &:first-child {
        margin-left: 0;
      }
    }
  }
`;
