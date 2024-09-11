import { useQuery } from '@hooks/useQuery';
import { getSectionList } from '../apis';
import { QueryKeys } from '../constants';

export const useSectionListService = (categoryId: number) => {
  const {
    data: sections,
    error,
    isError,
    isLoading,
    isFetching,
    isFetched,
    isSuccess,
  } = useQuery([QueryKeys.MAIN, QueryKeys.SECTION_LIST, categoryId], () => getSectionList({ categoryId }));

  return {
    sections,
    error,
    isError,
    isLoading,
    isFetching,
    isFetched,
    isSuccess,
  };
};
