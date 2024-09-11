import { useEffect } from 'react';
import { FeatureFlagsType } from '@contexts/FeatureFlagsContext';
import { useFeatureFlags } from '@hooks/useFeatureFlags';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { useLoading } from '@hooks/useLoading';
import { useWebInterface } from '@hooks/useWebInterface';
import type { GoodsCardWishChangeParams } from '@pui/goodsCard';
import { useWishUpdateService } from '@features/wish/services';
import { getWishList } from '../apis';
// import { wishListMockApi } from '../apis/__mocks__';
import { toWishListModel } from '../models';

export const useWishListService = () => {
  const { showLoading, hideLoading } = useLoading();
  const { emitWishItemUpdated } = useWebInterface();

  /** feature flag */
  const { getFeatureFlagsActiveStatus } = useFeatureFlags();
  const activeFeatureFlag = getFeatureFlagsActiveStatus(FeatureFlagsType.MWEB_DEV);

  const {
    data: wishListData,
    error: wishListError,
    isError: isWishListError,
    isLoading: isWishListLoading,
    isFetching: isWishListFetching,
    hasNextPage: hasMoreWishList,
    fetchNextPage: handleLoadWishList,
  } = useInfiniteQuery(
    ['myPage/wishList'],
    // Mock Data
    // ({ pageParam: nextParameter }) => wishListMockApi({ nextParameter }),
    ({ pageParam: nextParameter }) => getWishList({ nextParameter }),
    {
      select: ({ pages, ...params }) => ({ pages: pages.flatMap(toWishListModel), ...params }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
      cacheTime: 0,
    },
  );

  /** mutation 진행시 우선 wish의 state 를 갱신 */
  const { updateWish } = useWishUpdateService({
    wishOnMutate: ({ goodsId, goodsCode }) => {
      emitWishItemUpdated({
        goodsId,
        goodsCode,
        isAdded: true,
      });
    },
    unWishOnMutate: ({ goodsId, goodsCode }) => {
      emitWishItemUpdated({
        goodsId,
        goodsCode,
        isAdded: false,
      });
    },
  });

  /** Wish Update Handler */
  const handleChangeWish = (wish: GoodsCardWishChangeParams) => {
    const { goodsId, goodsCode, showRoomId, wished } = wish;

    updateWish(
      {
        goodsId,
        goodsCode,
        showRoomId,
        state: !wished,
      },
      {
        onError: () => {
          /** API 연동실패시에는 다시 Reset */
          emitWishItemUpdated({
            goodsId,
            goodsCode,
            isAdded: wished,
          });
        },
      },
    );
  };

  /**
   * 로딩바 처리
   */
  useEffect(() => {
    if (isWishListLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWishListLoading]);

  /**
   * unmount 시 emitWishItemUpdated null 처리
   */
  useEffect(() => {
    return () => {
      emitWishItemUpdated(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    wishListData: wishListData?.pages ?? [],
    wishListError,
    isWishListError,
    isWishListLoading,
    isWishListFetching,
    hasMoreWishList,
    activeFeatureFlag,
    handleLoadWishList,
    handleChangeWish,
  };
};
