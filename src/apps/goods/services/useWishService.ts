import { useQueryClient } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { useAuth } from '@hooks/useAuth';
import { useErrorService } from '@features/exception/services';
import { getWishList, postWishList, deleteWishList } from '../apis';
import { QueryKeys } from '../constants';
import { WishModel } from '../models';
import { useGoodsPageInfo } from '../hooks';

interface Props {
  onReload: () => void;
  onLogAddToWish: () => void;
}

export const useWishService = ({ onReload: handleReload, onLogAddToWish: handleLogAddToWish }: Props) => {
  const { getIsLogin } = useAuth();
  const { isApp } = useDeviceDetect();
  const { signIn, wishItemUpdated } = useWebInterface();
  const { goodsId, goodsPageId, showRoomId } = useGoodsPageInfo();
  const queryClient = useQueryClient();
  const { handleError } = useErrorService();

  const {
    data: wish,
    isLoading: isWishInfoLoading,
    isError: isWishInfoError,
  } = useQuery([QueryKeys.WISH, goodsId], () => getWishList({ goodsId }));

  const { isLoading: isWishLoading, mutateAsync: wishMutateAsync } = useMutation(
    () => postWishList({ goodsId, showRoomId }),
    {
      onSuccess: () => {
        queryClient.setQueryData<WishModel | undefined>([QueryKeys.WISH, goodsId], (prev) => {
          return {
            ...prev,
            hasWishItem: true,
          };
        });
        isApp && inAppWishItemUpdated(true);
        handleLogAddToWish();
      },
      onError: (error: ErrorModel) => {
        handleError({
          error,
        });
      },
    },
  );

  const { isLoading: isUnWishLoading, mutateAsync: unWishMutateAsync } = useMutation(
    () => deleteWishList({ goodsId }),
    {
      onSuccess: () => {
        queryClient.setQueryData<WishModel | undefined>([QueryKeys.WISH, goodsId], (prev) => {
          return {
            ...prev,
            hasWishItem: false,
          };
        });

        isApp && inAppWishItemUpdated(false);
      },
      onError: (error: ErrorModel) => {
        handleError({
          error,
        });
      },
    },
  );

  const inAppWishItemUpdated = async (hasWishItem: boolean) => {
    await wishItemUpdated({
      goodsId,
      isAdded: hasWishItem,
      goodsCode: goodsPageId,
    });
  };

  const handleUpdateWish = async () => {
    if (!getIsLogin()) {
      const signInResult = await signIn();
      if (signInResult) {
        handleReload();
        executeUpdateWish();
      }
      return;
    }
    executeUpdateWish();
  };

  const executeUpdateWish = () => {
    if (isWishInfoLoading || isWishLoading || isUnWishLoading) {
      return false;
    }
    return wish?.hasWishItem ? unWishMutateAsync() : wishMutateAsync();
  };

  const handleReloadWish = () => {
    queryClient.invalidateQueries([QueryKeys.WISH, goodsId]);
  };

  return {
    /**
     * Getting Wish
     */
    hasWishItem: wish?.hasWishItem ?? false,
    isWishInfoLoading,
    isWishInfoError,

    /**
     * Active Wish
     */
    handleUpdateWish,

    /**
     * Reload Wish
     */
    handleReloadWish,
  };
};
