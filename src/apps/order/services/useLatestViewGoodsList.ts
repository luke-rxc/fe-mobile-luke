import { useQuery } from '@hooks/useQuery';
import { useQueryClient } from 'react-query';
import { getLatestViewGoodsList } from '../apis';
import { toLatestViewGoodsModel } from '../models/LatestViewGoodsModel';

export const useLatestViewGoodsList = () => {
  const queryClient = useQueryClient();
  const {
    data: latestViewGoodsList,
    isFetched,
    isFetching,
  } = useQuery(['cart', 'latest', 'items'], () => getLatestViewGoodsList(), {
    select: ({ content }) => content?.map(toLatestViewGoodsModel) ?? [],
    onError: () => {
      queryClient.setQueryData(['cart', 'latest', 'items'], []);
    },
    cacheTime: 0,
  });

  return {
    latestViewGoodsList: latestViewGoodsList ?? [],
    isFetched,
    isFetching,
  };
};
