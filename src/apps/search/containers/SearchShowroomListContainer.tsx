import { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { PageError } from '@features/exception/components';
import { useLoading } from '@hooks/useLoading';
import { InfiniteScroller } from '@pui/InfiniteScroller';
import { TitleSection } from '@pui/titleSection';
import { rn2br } from '@utils/string';
import { SearchBrandListItemMedium } from '../components';
import { useSearchShowroomService, useLogService } from '../services';

interface Props {
  query?: string;
}

export const SearchShowroomListContainer = ({ query = '' }: Props) => {
  const { showLoading, hideLoading } = useLoading();
  const {
    isManualFetching,
    showrooms,
    showroomsError,
    isShowroomsError,
    isShowroomsLoading,
    isShowroomsFetching,
    hasMoreShowrooms,
    handleLoadShowrooms,
    handleClickBrandFollow,
    handleChangeBrandListFollow,
  } = useSearchShowroomService({ query });

  const { logBrandsListTabShowroom, logBrandsListTabGoods } = useLogService();

  useHeaderDispatch({
    type: 'mweb',
    title: '쇼룸',
    enabled: !isShowroomsLoading,
    quickMenus: ['cart', 'menu'],
  });

  useEffect(() => {
    if (isShowroomsLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowroomsLoading]);

  // Loading
  if (isShowroomsLoading) {
    return null;
  }

  /* eslint-disable no-nested-ternary */
  return (
    <Container>
      <TitleSection title="쇼룸" />
      {isShowroomsError ? (
        // Error
        <PageError error={showroomsError} />
      ) : isEmpty(showrooms) ? (
        // Empty
        <PageError description={rn2br('검색 결과가 없습니다\r\n다른 검색어를 입력해보세요')} />
      ) : (
        // Success
        <InfiniteScroller
          infiniteOptions={{ rootMargin: '50px' }}
          disabled={!hasMoreShowrooms}
          onScrolled={handleLoadShowrooms}
          loading={isShowroomsFetching && !isManualFetching}
          className="showroom-section-list"
        >
          {showrooms?.map((item, index) => (
            <SearchBrandListItemMedium
              key={item.showroomId}
              {...item}
              onClickFollow={handleClickBrandFollow}
              onChangeFollow={handleChangeBrandListFollow}
              onClickShowroomLink={() => {
                logBrandsListTabShowroom({
                  showroomId: `${item.showroomId}`,
                  showroomName: item.title,
                  showroomIndex: index,
                  onAir: !!item.onAir,
                  query,
                });
              }}
              onClickLiveLink={() => {
                logBrandsListTabShowroom({
                  showroomId: `${item.showroomId}`,
                  showroomName: item.title,
                  showroomIndex: index,
                  onAir: !!item.onAir,
                  query,
                  ...(item.liveId && { liveId: `${item.liveId}` }),
                });
              }}
              onClickGoodsList={(e, { goodsId, goodsName }, goodsIndex) => {
                logBrandsListTabGoods({
                  goodsId: `${goodsId}`,
                  goodsName,
                  goodsIndex,
                  query,
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
