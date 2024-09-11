import qs from 'qs';
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQueryString } from '@hooks/useQueryString';
import { GoodsListProps } from '../components';
import { Showroom } from '../types';
import { useGoodsListQuery } from './queries';
import { useLogService } from './useLogService';

interface Props {
  showroomCode: string;
  showroomId: number;
  showroomName: string;
  showroomType: Showroom;
}

export const useGoodsService = ({ showroomCode, showroomId, showroomName, showroomType }: Props) => {
  const { categoryFilter, sort } = useQueryString<{ categoryFilter: string; sort: string }>();
  const [filterId, setFilterId] = useState<number>(categoryFilter ? +categoryFilter : 0);

  const { pathname } = useLocation();
  const history = useHistory();
  const logger = useLogService();

  const goodsListQuery = useGoodsListQuery(
    {
      showroomCode,
      showroomId,
      categoryFilter: filterId,
      sort,
    },
    {
      enabled: !!showroomId && showroomType !== 'CONCEPT',
      onSuccess: (page) => {
        logger.logGoodsLoadMore(page, showroomId, showroomName);
      },
      /**
       * Filter 변경 시, 스크롤 최상단으로 이동하는 현상 방지
       */
      keepPreviousData: filterId === 0 || !!filterId,
    },
  );

  /**
   * 상품 클릭 이벤트 핸들러
   */
  const handleClickGoods: GoodsListProps['onClickGoods'] = (item) => {
    logger.logGoodsTab(item, showroomId, showroomName);
  };

  /**
   * 상품 Filter 클릭 이벤트 핸들러
   */
  const handleChangeTabFilter: GoodsListProps['onChangeTabFilter'] = (_, option, index) => {
    const { name, id } = option;
    setFilterId(id);
    logger.logShowroomTabFilter(name, id, index + 1, showroomName, showroomId);
    history.replace([pathname, qs.stringify({ categoryFilter: id, sort })].join('?'));
  };

  /**
   * 상품 Sorting 변경 이벤트 핸들러
   */
  const handleChangeTabSorting: GoodsListProps['onChangeTabSorting'] = (_, { value }) => {
    logger.logShowroomTabSorting(showroomName, showroomId, value);
    history.replace([pathname, qs.stringify({ categoryFilter, sort: value })].join('?'));
  };

  return {
    goods: goodsListQuery.data && {
      goods: goodsListQuery.data.pages,
      goodsError: goodsListQuery.error,
      isGoodsError: goodsListQuery.isError,
      isGoodsLoading: goodsListQuery.isLoading,
      isGoodsFetching: goodsListQuery.isFetching,
      hasMoreGoods: goodsListQuery.hasNextPage,
      selectedFilterId: filterId,
      defaultSortingValue: goodsListQuery.sort,
      onLoadGoods: goodsListQuery.fetchNextPage,
      onClickGoods: handleClickGoods,
      onChangeTabFilter: handleChangeTabFilter,
      onChangeTabSorting: handleChangeTabSorting,
    },
  };
};
