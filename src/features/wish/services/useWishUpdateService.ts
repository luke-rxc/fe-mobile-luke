import { useCallback } from 'react';
import type { UseMutationOptions, MutateOptions } from 'react-query';
import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { useAuth } from '@hooks/useAuth';
import { useErrorService } from '@features/exception/services';
import { createDebug } from '@utils/debug';
import { postWishList, deleteWishList, WishPostParams } from '../apis';
import { WishUpdateModel } from '../models';

const debug = createDebug('features:wish:useWishUpdateService');

interface UpdateMutationParams extends WishPostParams {
  goodsCode: string;
}

interface UpdatedWishParams extends UpdateMutationParams {
  // 변경하고자 하는 wish 상태값
  state: boolean;
}

type OnMutate = Pick<UseMutationOptions<void, ErrorModel, UpdateMutationParams>, 'onMutate'>;

interface Props {
  /** feature flag */
  activeFeatureFlag?: boolean;

  /** onMutate Callback */
  wishOnMutate?: OnMutate['onMutate'];
  unWishOnMutate?: OnMutate['onMutate'];
}

export const useWishUpdateService = ({ wishOnMutate, unWishOnMutate }: Props) => {
  const { getIsLogin } = useAuth();
  const { isApp } = useDeviceDetect();
  const { signIn, wishItemUpdated } = useWebInterface();
  const { handleError } = useErrorService();

  const wish = useMutation(({ goodsId, showRoomId }) => postWishList({ goodsId, showRoomId }), {
    ...(wishOnMutate && { onMutate: wishOnMutate }),
    onSuccess: (_, { goodsId, goodsCode }) => {
      debug.log('wish success', goodsId, goodsCode);

      isApp &&
        wishItemUpdated({
          goodsId,
          goodsCode,
          isAdded: true,
        });
    },
    onError: (error: ErrorModel) => {
      debug.log('wish error', error);

      handleError({
        error,
      });
    },
  });

  const unWish = useMutation(({ goodsId }) => deleteWishList({ goodsId }), {
    ...(unWishOnMutate && { onMutate: unWishOnMutate }),
    onSuccess: (_, { goodsId, goodsCode }) => {
      debug.log('unWish success', goodsId, goodsCode);

      isApp &&
        wishItemUpdated({
          goodsId,
          goodsCode,
          isAdded: false,
        });
    },
    onError: (error: ErrorModel) => {
      debug.log('unWish error', error);

      handleError({
        error,
      });
    },
  });

  const updateWish = useCallback(
    async (
      { goodsId, goodsCode, state, showRoomId }: UpdatedWishParams,
      mutateOptions?: MutateOptions<WishUpdateModel, ErrorModel, UpdateMutationParams>,
    ) => {
      // 로그인 체크
      if (!getIsLogin() && !(await signIn())) {
        return;
      }

      // 로딩 체크
      if (wish.isLoading || unWish.isLoading) {
        return;
      }

      // mutate
      if (state) {
        wish.mutate(
          {
            goodsId,
            goodsCode,
            showRoomId,
          },
          mutateOptions,
        );
      } else {
        unWish.mutate(
          {
            goodsId,
            goodsCode,
          },
          mutateOptions,
        );
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [wish.isLoading, unWish.isLoading],
  );

  return {
    isLoading: wish.isLoading || unWish.isLoading,
    isSuccess: wish.isSuccess || unWish.isSuccess,
    isError: wish.isError || unWish.isLoading,
    updateWish,
  };
};
