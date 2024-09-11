import { useQuery } from '@hooks/useQuery';
import { toGoodsDetail } from '../models';
import { getGoodsDetail } from '../apis';
// import { goodsDetailMockApi } from '../apis/__mocks__';
import { QueryKeys } from '../constants';

interface Props {
  goodsId: number;
}

export const useGoodsDetailService = ({ goodsId }: Props) => {
  const {
    data: detailList,
    isFetched,
    isLoading,
    isError,
    error,
  } = useQuery(
    [QueryKeys.DETAIL, goodsId],
    async () => {
      const res = await getGoodsDetail({ goodsId });
      return res;
    },
    /* async () => {
      const res = await goodsDetailMockApi({ goodsId });
      return res;
    }, */
    {
      select: (data) => toGoodsDetail(data),
    },
  );

  return {
    detailList,
    isFetched,
    isLoading,
    isError,
    error,
  };
};
