import { useRef, useCallback } from 'react';
import { QueryFunctionContext, UseInfiniteQueryOptions, InfiniteData } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { Awaited } from '../../types';
import { DiscoverQueryKeys } from '../../constants';
import { getDiscoverSectionGoods, GetDiscoverSectionGoodsParams } from '../../apis';
import { SectionMetaDataSchema } from '../../schemas';
import { toSectionGoodsModel, SectionGoodsModel, toSectionHeaderListModel, SectionHeaderListModel } from '../../models';

type QueryFunctionCtx = QueryFunctionContext<ReturnType<typeof DiscoverQueryKeys['sectionGoods']>, string>;
type QueryOptions = UseInfiniteQueryOptions<
  Awaited<ReturnType<typeof getDiscoverSectionGoods>>,
  ErrorModel,
  ArrayElement<SectionGoodsModel>
>;

/**
 * 상품 섹션 Infinite service
 */
export const useSectionGoodsQuery = (
  params: GetDiscoverSectionGoodsParams,
  options?: Omit<QueryOptions, 'onSuccess'> & {
    onSuccess?: (
      data: InfiniteData<ArrayElement<SectionGoodsModel>>,
      latestData: InfiniteData<ArrayElement<SectionGoodsModel>>['pages'],
      metaData: SectionMetaDataSchema,
    ) => void;
  },
) => {
  const count = useRef<number>(0);
  const sectionMeta = useRef<SectionMetaDataSchema | undefined>();
  const sectionTitle = useRef<string>('');
  const sectionSort = useRef<string>('');
  const sectionHeader = useRef<SectionHeaderListModel | undefined>();

  const queryFn = useCallback(({ queryKey, pageParam }: QueryFunctionCtx) => {
    const [{ params: feedParams }] = queryKey;
    return getDiscoverSectionGoods({ ...feedParams, pageParam });
  }, []);

  /**
   * query key에 대한 타입추론 이슈가 있어 'as QueryFunctionCtx' 를 사용
   * @link https://github.com/TanStack/query/issues/1462
   */
  const query = useInfiniteQuery(DiscoverQueryKeys.sectionGoods(params), (ctx) => queryFn(ctx as QueryFunctionCtx), {
    ...options,
    select: ({ pages, pageParams }) => {
      const { title = '', sort = '', headerList } = pages[0].metadata;

      sectionTitle.current = title;
      sectionSort.current = sort;
      sectionMeta.current = sectionMeta.current || pages[0].metadata;
      sectionHeader.current = sectionHeader.current || (headerList && toSectionHeaderListModel(headerList));

      count.current = pages.slice(0, -1).reduce((acc, cur) => acc + cur.content.length || 0, 0);

      return { pages: toSectionGoodsModel(pages, params), pageParams };
    },
    onSuccess: (data) => {
      options &&
        options.onSuccess?.(data, data.pages.slice(count.current), sectionMeta.current as SectionMetaDataSchema);
    },
    getNextPageParam: ({ nextParameter }) => nextParameter,
  });

  return {
    ...query,
    title: sectionTitle.current,
    sort: sectionSort.current,
    headers: sectionHeader.current,
    metaData: sectionMeta.current,
  };
};
