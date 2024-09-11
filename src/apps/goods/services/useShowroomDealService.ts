import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { QueryKeys } from '../constants';
import { getDeals } from '../apis';
import { ShowroomModel, toDealsModel } from '../models';
import { useGoodsPageInfo } from '../hooks';
// import { dealsMockApi } from '../apis/__mocks__';

interface Props {
  showroom?: ShowroomModel;
  enabled: boolean;
  onLogShowroomTabOnBottom: () => void;
  onRemoveLiveFloating: (liveId: number) => void;
}

export const useShowroomDealService = ({
  showroom,
  enabled,
  onLogShowroomTabOnBottom: handleLogShowroomTabOnBottom,
  onRemoveLiveFloating: handleRemoveLiveFloating,
}: Props) => {
  const { goodsId, isInLivePage } = useGoodsPageInfo();
  const showroomId = showroom?.id ?? 0;
  /**
   * 쇼룸 리스트 로드
   */
  const {
    data: deals,
    error: dealsError,
    isError: isDealsError,
    isLoading: isDealsLoading,
    isFetching: isDealsFetching,
    hasNextPage: hasMoreDeals,
    fetchNextPage: handleLoadDeals,
  } = useInfiniteQuery(
    QueryKeys.DEALS,
    // ({ pageParam: nextParameter }) => dealsMockApi({ nextParameter, showroomId, goodsId }),
    ({ pageParam: nextParameter }) => getDeals({ nextParameter, showroomId, goodsId }),
    {
      enabled,
      select: ({ pages, ...params }) => ({ pages: pages.flatMap(toDealsModel), ...params }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
      cacheTime: 0,
    },
  );

  const handleShowroomProfileClick = () => {
    handleLogShowroomTabOnBottom();
    showroom?.liveId && handleRemoveLiveFloating(showroom.liveId);
  };

  return {
    // 쇼룸노출 여부
    isShowroomActive: !!(showroom && showroom.primaryImage && !isInLivePage),
    deals,
    dealsError,
    isDealsError,
    isDealsLoading,
    isDealsFetching,
    hasMoreDeals,
    handleLoadDeals,
    handleShowroomProfileClick,
  };
};
