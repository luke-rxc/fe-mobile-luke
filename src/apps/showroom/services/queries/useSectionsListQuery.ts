import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { ErrorModel } from '@utils/api/createAxios';
import { LoadMoreResponseSchema } from '@schemas/loadMoreResponse';
import { UseInfiniteQueryOptions } from 'react-query';
import { getSectionsList, GetSectionsListParams, GetShowroomParam } from '../../apis';
import { ShowroomQueryKeys } from '../../constants';
import { toSectionsListModel } from '../../models';
import { SectionItemSchema } from '../../schemas';
import { Awaited } from '../../types';

type DataItem = ReturnType<typeof toSectionsListModel>[0];
type QueryFnData = Awaited<ReturnType<typeof getSectionsList>>;
type QueryFunctionParams = GetSectionsListParams & Pick<GetShowroomParam, 'showroomCode'>;
type QueryFunctionOptions = Omit<
  UseInfiniteQueryOptions<QueryFnData, ErrorModel, DataItem>,
  'initialData' | 'select' | 'getNextPageParam'
> & {
  /** 초기 데이터 */
  initialData?: LoadMoreResponseSchema<SectionItemSchema>;
};

export const useSectionGoodsQuery = (
  { showroomCode, size = 4, ...params }: QueryFunctionParams,
  options?: QueryFunctionOptions,
) => {
  const { initialData, ...restOptions } = options || {};

  return useInfiniteQuery(
    ShowroomQueryKeys.sectionList(showroomCode, { size, ...params }),
    ({ pageParam: nextParameter }) => getSectionsList({ ...params, nextParameter }),
    {
      getNextPageParam: ({ nextParameter }) => nextParameter,
      select: ({ pages, pageParams }) => {
        return {
          pages: toSectionsListModel(pages?.flatMap(({ content }) => content)),
          pageParams,
        };
      },
      cacheTime: 0,
      initialData: initialData && { pages: [initialData], pageParams: [initialData.nextParameter] },
      ...restOptions,
    },
  );
};
