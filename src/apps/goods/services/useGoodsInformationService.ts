import { useQuery } from '@hooks/useQuery';
import { getGoodsInformation } from '../apis';
// import { goodsInformationMockApi } from '../apis/__mocks__';
import { QueryKeys } from '../constants';

interface Props {
  goodsId: number;
}

export const useGoodsInformationService = ({ goodsId }: Props) => {
  const {
    data: informationList,
    isLoading,
    isError,
    error,
  } = useQuery(
    [QueryKeys.INFORMATION, goodsId],
    async () => {
      const res = await getGoodsInformation({ goodsId });
      return res;
    },
    /* async () => {
      const res = await goodsInformationMockApi({ goodsId });
      return res;
    }, */
  );

  return {
    informationList,
    isLoading,
    isError,
    error,
  };
};
