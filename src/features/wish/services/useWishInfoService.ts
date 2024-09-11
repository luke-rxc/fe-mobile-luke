import { useQueryClient } from 'react-query';
import { useQuery } from '@hooks/useQuery';
import { getWishList } from '../apis';

interface Props {
  goodsId: number;
}

export const useWishInfoService = ({ goodsId }: Props) => {
  const queryClient = useQueryClient();

  /** 해당 상품 Wish 정보 불러오기 */
  const { data: wishInfo, isLoading, isError, error } = useQuery(['wish', goodsId], () => getWishList({ goodsId }));

  /**
   * 해당 상품 Wish 업데이트
   * @description 예를 들어 다른 action 으로 인해 로그인 발생시, 수동으로 업데이트를 시켜주기 위한 목적
   */
  const handleReload = () => {
    queryClient.invalidateQueries(['wish', goodsId]);
  };

  return {
    wishInfo,
    isLoading,
    isError,
    error,
    handleReload,
  };
};
