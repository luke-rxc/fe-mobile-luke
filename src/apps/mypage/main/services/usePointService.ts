import { useQuery } from '@hooks/useQuery';
import { getPoint } from '../apis';
import { MYPAGE_POINT_QUERY_KEY } from '../constants';

/**
 * 적립금 조회
 */
export const usePointService = () => {
  const {
    data: point,
    isLoading: isPointLoading,
    isError: isPointError,
    error: pointError,
  } = useQuery(MYPAGE_POINT_QUERY_KEY, getPoint);

  return {
    point,
    isPointLoading,
    isPointError,
    pointError,
  };
};
