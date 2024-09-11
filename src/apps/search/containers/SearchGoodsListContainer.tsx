import { useEffect } from 'react';
import styled from 'styled-components';
import { GoodsSortingType } from '@constants/goods';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { PageError } from '@features/exception/components';
import { Sticky } from '@features/landmark/components/sticky';
import { useLoading } from '@hooks/useLoading';
import { GoodsList } from '@pui/goodsList';
import { FilterBar } from '@features/filter';
import { rn2br } from '@utils/string';
import { useSearchGoodsService, useLogService } from '../services';
import type { GoodsSearchQueryParams } from '../types';

export const SearchGoodsListContainer = (params: GoodsSearchQueryParams) => {
  const { query = '' } = params;
  const { showLoading, hideLoading } = useLoading();
  const {
    filterValue,
    sortingValue,
    isCategoryAll,
    goodsFilter,
    goodsFilterError,
    isGoodsFilterError,
    isGoodsFilterLoading,
    handleChangeGoodsFilter,
    handleChangeGoodsSorting,
    goods,
    goodsError,
    isGoodsError,
    isGoodsLoading,
    isGoodsFetching,
    hasMoreGoods,
    handleLoadGoods,
  } = useSearchGoodsService(params);

  const { logGoodsListTabGoods } = useLogService();

  useHeaderDispatch({
    type: 'mweb',
    title: '상품',
    // 로딩으로 처리시 필터 Sticky 노출 시점의 이질감이 있어서 기본값 true로 변경
    enabled: true,
    quickMenus: ['cart', 'menu'],
  });

  useEffect(() => {
    if (isGoodsLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGoodsLoading]);

  // Filter Loading
  if (isGoodsFilterLoading) {
    return null;
  }

  // Filter Error
  if (isGoodsFilterError) {
    return <PageError error={goodsFilterError} />;
  }

  // Empty Page (전체 카테고리 & 상품이 없는 경우)
  if (isCategoryAll && goods?.length === 0) {
    return <PageError description={rn2br('검색 결과가 없습니다\r\n다른 검색어를 입력해보세요')} />;
  }

  /* eslint-disable no-nested-ternary */
  return (
    <Container>
      {/* 정렬 조건이 설정된 이후 노출 */}
      {!!goodsFilter?.category && sortingValue && (
        <FilterBar
          category={{
            value: filterValue,
            options: goodsFilter.category,
            getValue: ({ value }) => value,
            onChange: handleChangeGoodsFilter,
          }}
          sort={{
            defaultValue: sortingValue as GoodsSortingType,
            options: goodsFilter.sort,
            onChange: handleChangeGoodsSorting,
          }}
        />
      )}
      {isGoodsError ? (
        // Goods Error
        <PageError error={goodsError} />
      ) : isGoodsLoading ? (
        // Goods Loading
        <></>
      ) : !goods?.length ? (
        // Goods Empty
        <PageError description={rn2br('검색 결과가 없습니다\r\n다른 검색어를 입력해보세요')} />
      ) : (
        <GoodsList
          infiniteOptions={{ rootMargin: '50px' }}
          disabled={!hasMoreGoods}
          onScrolled={handleLoadGoods}
          loading={isGoodsFetching}
          goodsList={goods}
          onListClick={({ goodsId, goodsName }, goodsIndex) => {
            logGoodsListTabGoods({ goodsId: `${goodsId}`, goodsName, goodsIndex, query });
          }}
        />
      )}
    </Container>
  );
  /* eslint-enable no-nested-ternary */
};

const Container = styled.div`
  margin-bottom: 2.4rem;

  ${Sticky} {
    margin-bottom: 1.2rem;
  }
`;
