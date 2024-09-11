import { useEffect, useRef } from 'react';
import { useUpdateEffect } from 'react-use';
import type { InfiniteData } from 'react-query';
import isEmpty from 'lodash/isEmpty';
import qs from 'qs';
import { GoodsSortingType } from '@constants/goods';
import { useQuery } from '@hooks/useQuery';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import type { GoodsCardProps } from '@pui/goodsCard';
import { getShowroomRegionFilter, getShowroomRegionSearchList } from '../apis';
import { ShowroomRegionQueryKey } from '../constants';
import { useRegionSearchQuery } from '../hooks';
import { toRoomFilterModel, toShowroomRegionRoomSearchModel } from '../models';
import { getStayNights } from '../utils';
import { useShowroomRegionLog } from './logs';

type RegionModalReceiveDataTypes = {
  rootPlace: string;
  startDate: number;
  endDate: number;
};

type FilterModalReceiveDataTypes = {
  rootPlace: string;
  tagFilter?: number[];
};

export const useShowroomRegionService = ({ showroomId }: { showroomId: number }) => {
  const sortRef = useRef<GoodsSortingType>(GoodsSortingType.POPULARITY);
  const { receiveValues } = useWebInterface();
  const { query, updateQuery } = useRegionSearchQuery();
  const { rootPlace } = query;
  const logs = useShowroomRegionLog();

  const {
    data: filter,
    error: filterError,
    isError: isFilterError,
    isLoading: isFilterLoading,
    isFetching: isFilterFetching,
    isFetched: isFilterFetched,
    isSuccess: isFilterSuccess,
  } = useQuery(
    [ShowroomRegionQueryKey.ALL, ShowroomRegionQueryKey.ROOM_FILTER, { showroomId, rootPlace }],
    () => getShowroomRegionFilter({ showroomId, rootPlace }),
    {
      select: toRoomFilterModel,
    },
  );

  const {
    data: goods,
    error: goodsError,
    isError: isGoodsError,
    isLoading: isGoodsLoading,
    isFetching: isGoodsFetching,
    isFetched: isGoodsFetched,
    isSuccess: isGoodsSuccess,
    hasNextPage: hasMoreGoods,
    fetchNextPage: handleLoadGoods,
  } = useInfiniteQuery(
    [ShowroomRegionQueryKey.ALL, ShowroomRegionQueryKey.ROOM_LIST, { showroomId, ...query }],
    ({ pageParam: nextParameter }) => getShowroomRegionSearchList({ showroomId, ...query, nextParameter }),
    {
      select: ({ pages, ...params }) => {
        const [{ metadata }] = pages;

        sortRef.current = metadata.sort;

        return { pages: pages.flatMap((raw) => toShowroomRegionRoomSearchModel(raw, query)), ...params };
      },
      getNextPageParam: ({ nextParameter }) => nextParameter,
      onSuccess: (result: InfiniteData<GoodsCardProps>) => {
        const { pageParams } = result;
        const lastParams = (pageParams[pageParams.length - 1] ?? '') as string;
        const { offset = '0' } = qs.parse(lastParams);
        const impressionGoods = result.pages.slice(Number(offset));

        logs.logImpressionGoods({
          goodsId: impressionGoods.map(({ goodsId }) => goodsId),
          goodsName: impressionGoods.map(({ goodsName }) => goodsName),
          goodsIndex: impressionGoods.map((_, index) => Number(offset) + (index + 1)),
          regionName: query.rootPlace,
          searchNights: `${getStayNights(query.startDate, query.endDate)}`,
        });
      },
    },
  );

  useUpdateEffect(() => {
    if (isEmpty(receiveValues)) return;

    const receiveData = receiveValues as RegionModalReceiveDataTypes | FilterModalReceiveDataTypes;

    // 지역/날짜 모달의 ReceiveData 여부
    const isRegionModalData = 'startDate' in receiveData;

    if (isRegionModalData) {
      updateQuery({ ...receiveData });
    } else {
      // 태그가 없는 경우 태그 초기화
      updateQuery({ tagFilter: [], ...receiveData });
    }
  }, [receiveValues]);

  useEffect(() => {
    logs.logViewPage({ regionName: rootPlace, searchNights: `${getStayNights(query.startDate, query.endDate)}` });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    query,
    filter,
    filterError,
    isFilterError,
    isFilterLoading,
    isFilterFetching,
    isFilterFetched,
    isFilterSuccess,
    goods: goods?.pages,
    goodsSortValue: sortRef.current,
    goodsError,
    isGoodsError,
    isGoodsLoading,
    isGoodsFetching,
    isGoodsFetched,
    isGoodsSuccess,
    hasMoreGoods,
    handleLoadGoods,
    ...logs,
  };
};
