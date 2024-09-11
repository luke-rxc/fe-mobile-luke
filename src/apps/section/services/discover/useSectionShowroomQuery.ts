import { useRef, useCallback } from 'react';
import { QueryFunctionContext, UseInfiniteQueryOptions, InfiniteData } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { Awaited } from '../../types';
import { DiscoverQueryKeys } from '../../constants';
import { SectionMetaDataSchema } from '../../schemas';
import { getDiscoverSectionShowroom, GetDiscoverSectionShowroomParams } from '../../apis';
import {
  toSectionShowroomModel,
  SectionShowroomModel,
  toSectionHeaderListModel,
  SectionHeaderListModel,
} from '../../models';

type QueryFunctionCtx = QueryFunctionContext<ReturnType<typeof DiscoverQueryKeys['sectionShowroom']>, string>;
type QueryOptions = UseInfiniteQueryOptions<
  Awaited<ReturnType<typeof getDiscoverSectionShowroom>>,
  ErrorModel,
  ArrayElement<SectionShowroomModel>
>;
/**
 * 쇼룸 섹션 Infinite Query
 */
export const useSectionShowroomQuery = (
  params: GetDiscoverSectionShowroomParams,
  options?: Omit<QueryOptions, 'onSuccess'> & {
    onSuccess?: (
      data: InfiniteData<ArrayElement<SectionShowroomModel>>,
      latestData: InfiniteData<ArrayElement<SectionShowroomModel>>['pages'],
    ) => void;
  },
) => {
  const count = useRef<number>(0);
  const sectionMeta = useRef<SectionMetaDataSchema | undefined>();
  const sectionTitle = useRef<string>('');
  const sectionHeader = useRef<SectionHeaderListModel | undefined>();

  const queryFn = useCallback(({ queryKey, pageParam }: QueryFunctionCtx) => {
    const [{ params: feedParams }] = queryKey;
    return getDiscoverSectionShowroom({ ...feedParams, pageParam });
  }, []);

  /**
   * query key에 대한 타입추론 이슈가 있어 'as QueryFunctionCtx' 를 사용
   * @link https://github.com/TanStack/query/issues/1462
   */
  const query = useInfiniteQuery(DiscoverQueryKeys.sectionShowroom(params), (ctx) => queryFn(ctx as QueryFunctionCtx), {
    ...options,
    select: ({ pages, pageParams }) => {
      const { title = '', headerList } = pages[0].metadata;

      sectionTitle.current = title;
      sectionMeta.current = sectionMeta.current || pages[0].metadata;
      sectionHeader.current = sectionHeader.current || (headerList && toSectionHeaderListModel(headerList));

      count.current = pages.slice(0, -1).reduce((acc, cur) => acc + cur.content.length || 0, 0);

      return { pages: toSectionShowroomModel(pages, sectionMeta.current), pageParams };
    },
    onSuccess: (data) => {
      options && options.onSuccess?.(data, data.pages.slice(count.current));
    },
    getNextPageParam: ({ nextParameter }) => nextParameter,
  });

  return { ...query, title: sectionTitle.current, headers: sectionHeader.current, metaData: sectionMeta.current };
};
