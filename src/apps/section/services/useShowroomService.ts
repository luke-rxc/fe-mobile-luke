import qs from 'qs';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { InfiniteData, UseInfiniteQueryResult, useQuery, useQueryClient } from 'react-query';
import { ErrorDataModel, ErrorModel } from '@utils/api/createAxios';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { useQueryString } from '@hooks/useQueryString';
import { GoodsCardProps } from '@pui/goodsCard';
import { TabDataType, TabsProps } from '@pui/tabs';
import { createDebug } from '@utils/debug';
import { useSection } from '../hooks';
import { FilterSchema, SectionMetaDataSchema } from '../schemas';
import { getShowroomGoodsFilterList, getShowroomGoodsList } from '../apis';
import { SectionTypes, ShowroomSectionQueryKeys } from '../constants';
import { toFilterModel, toSectionGoodsModel } from '../models';
import { useSectionGoodsLog } from './logs';
import { GetHandlers } from './useDiscoverService';

const debug = createDebug();

export const useShowroomService = () => {
  const logger = useSectionGoodsLog(debug);
  const { sectionId, activeSection } = useSection();
  const { categoryFilter, sort } = useQueryString<{ categoryFilter: string; sort: string }>();
  const metaData = useRef<SectionMetaDataSchema>({ id: 0, title: '', sort: '' });

  const [filterId, setFilterId] = useState<number>(categoryFilter ? +categoryFilter : 0);

  const queryClient = useQueryClient();
  const sectionGoodsQueryKey = ShowroomSectionQueryKeys.sectionGoods({
    sectionId: +sectionId,
    categoryFilter: filterId,
    sort,
  });

  const { pathname } = useLocation();
  const history = useHistory();

  /**
   * 쇼룸 섹션 > 상품 정보 조회 Query
   */
  const goodsQuery = useInfiniteQuery(
    sectionGoodsQueryKey,
    ({ pageParam: nextParameter }) =>
      getShowroomGoodsList({ sectionId: +sectionId, categoryFilter: filterId, sort, nextParameter }),
    {
      select: ({ pages, pageParams }) => {
        metaData.current = pages[0].metadata;
        return {
          pages: toSectionGoodsModel(pages, { sectionId: +sectionId, categoryFilter: filterId, sort }),
          pageParams,
        };
      },
      getNextPageParam: ({ nextParameter }) => nextParameter,
      onSuccess: (result: InfiniteData<GoodsCardProps>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = queryClient.getQueryData<InfiniteData<any>>(sectionGoodsQueryKey);
        const lastGoodsIndex = data?.pages.slice(0, -1).flatMap(({ content }) => content).length || 0;

        logger.logSectionGoodsImpression({ ...metaData.current, list: result.pages.slice(lastGoodsIndex) });
      },
      keepPreviousData: filterId === 0 || !!filterId,
    },
  );

  /**
   * 쇼룸 섹션 > 상품 Filter 조회 Query
   */
  const sectionFilterQuery = useQuery(
    ShowroomSectionQueryKeys.sectionFilter(+sectionId),
    () => getShowroomGoodsFilterList({ sectionId: +sectionId }),
    {
      select: toFilterModel,
      cacheTime: 0,
      staleTime: Infinity,
    },
  );

  /**
   * 카테고리 필터 반환
   *
   * 카테고리 필터가 2개 이상인 경우 카테고리 필터 노출(이때 전체 항목 추가)
   */
  const getSectionFilter = () => {
    if (sectionFilterQuery.data?.categoryFilter && sectionFilterQuery.data?.categoryFilter.length > 1) {
      return [{ name: '전체', id: 0 }].concat(sectionFilterQuery.data.categoryFilter);
    }

    return undefined;
  };

  /**
   * 상품 Filter 클릭 이벤트 핸들러
   */
  const handleChangeTabFilter = (data: ArrayElement<FilterSchema['categoryFilter']>, index: number) => {
    const { id, name } = data;
    setFilterId(id);

    logger.logSectionGoodsFilterTab({ ...metaData.current, item: { id, name, index: index + 1 } });
    history.replace([pathname, qs.stringify({ categoryFilter: id, sort })].join('?'));
  };

  /**
   * 상품 Sorting 변경 이벤트 핸들러
   */
  const handleChangeTabSorting = (value: string) => {
    logger.logSectionGoodsSortingTab({ ...metaData.current, sortType: value });

    history.replace([pathname, qs.stringify({ categoryFilter, sort: value })].join('?'));
  };

  const getHandlers: GetHandlers = {
    [SectionTypes.GOODS]: {
      onListClick: (item: GoodsCardProps) => {
        logger.logSectionGoodsTab({ ...metaData.current, item });
      },
    },
  };

  /**
   * 섹션 타입별 Query 호출
   */
  const query: { [key in string]: UseInfiniteQueryResult<GoodsCardProps, ErrorModel<ErrorDataModel>> } = {
    [SectionTypes.GOODS]: goodsQuery,
  };

  useEffect(() => {
    if (goodsQuery.data) {
      /**
       * 섹션 페이지 진입 로깅
       */
      switch (activeSection) {
        case SectionTypes.GOODS:
          logger.logSectionGoodsPageView(metaData.current);
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaData.current]);

  return {
    ...query[activeSection],
    metaData: metaData.current,
    getHandlers: getHandlers[activeSection],

    /** Filter & Sorting */
    filterList: getSectionFilter(),
    sortingOptions: sectionFilterQuery.data && sectionFilterQuery.data.sort,
    selectedFilterId: filterId,
    handleChangeTabFilter,
    handleChangeTabSorting,
  };
};
