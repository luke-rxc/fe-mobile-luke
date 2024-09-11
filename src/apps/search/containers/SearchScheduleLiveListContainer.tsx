import { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { PageError } from '@features/exception/components';
import { useLoading } from '@hooks/useLoading';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { TitleSection } from '@pui/titleSection';
import { rn2br } from '@utils/string';
import { SearchLiveListItem } from '../components';
import { useSearchScheduleLiveService, useLogService } from '../services';

interface Props {
  query?: string;
}

export const SearchScheduleLiveListContainer = ({ query = '' }: Props) => {
  const { showLoading, hideLoading } = useLoading();
  const {
    isManualFetching,
    live,
    liveError,
    isLiveError,
    isLiveLoading,
    isLiveFetching,
    hasMoreLive,
    handleLoadLive,
    handleClickLiveFollow,
    handleChangeLiveListFollow,
  } = useSearchScheduleLiveService({ query });

  const { logLiveListTabThumbnail } = useLogService();

  useHeaderDispatch({
    type: 'mweb',
    title: '라이브',
    enabled: !isLiveLoading,
    quickMenus: ['cart', 'menu'],
  });

  useEffect(() => {
    if (isLiveLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLiveLoading]);

  // Loading
  if (isLiveLoading) {
    return null;
  }

  /* eslint-disable no-nested-ternary */
  return (
    <Container>
      <TitleSection title="라이브" />
      {isLiveError ? (
        // Error
        <PageError error={liveError} />
      ) : isEmpty(live) ? (
        // Empty
        <PageError description={rn2br('검색 결과가 없습니다\r\n다른 검색어를 입력해보세요')} />
      ) : (
        // Success
        <InfiniteScroller
          infiniteOptions={{ rootMargin: '50px' }}
          disabled={!hasMoreLive}
          onScrolled={handleLoadLive}
          loading={isLiveFetching && !isManualFetching}
          className="live-section-list"
        >
          {/* showroomId는 로그 트래킹용으로 제외 */}
          {live?.map(({ showroomId, ...item }, index) => (
            <SearchLiveListItem
              key={item.scheduleId}
              {...item}
              onClickFollow={handleClickLiveFollow}
              onChangeFollow={handleChangeLiveListFollow}
              onClick={() => {
                logLiveListTabThumbnail({
                  scheduleId: `${item.scheduleId}`,
                  scheduleName: item.title,
                  scheduleIndex: index,
                  onAir: !!item.onAir,
                  query,
                  ...(item.onAir && item.liveId && { liveId: `${item.liveId}` }),
                });
              }}
            />
          ))}
        </InfiniteScroller>
      )}
    </Container>
  );
  /* eslint-enable no-nested-ternary */
};

const Container = styled.div`
  margin-bottom: 2.4rem;
`;
