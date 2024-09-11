import type { MutateOptions } from 'react-query';
import { useMutation } from '@hooks/useMutation';
import { ErrorModel } from '@utils/api/createAxios';
import { useErrorService } from '@features/exception/services';
import { postCart, postOrder, postSeatOrder, SaveActionParam, SeatSaveActionParam } from '../apis';
import { OptionSaveActionType } from '../constants';
import { useGoodsPageInfo } from '../hooks';
import { OrderSaveModel, OptionSelectedModel } from '../models';
import { deleteLayoutLock, LayoutLockParams } from '../apis/options';

interface ActionSaveParams {
  optionId: number;
  quantity: number;
}

interface SeatActionSaveParams extends ActionSaveParams {
  secondaryId: number;
}

export interface HandleActionSaveParam {
  type: OptionSaveActionType;
  params: ActionSaveParams[] | SeatActionSaveParams[];
  logParams: OptionSelectedModel;
}

interface Props {
  cartMutateOptions: MutateOptions<'ok', ErrorModel, SaveActionParam>;
  orderMutateOptions: MutateOptions<OrderSaveModel, ErrorModel, SaveActionParam>;
  seatOrderMutateOptions: MutateOptions<OrderSaveModel, ErrorModel, SeatSaveActionParam>;
  onLogAddToCart: (optionSelectedParams: OptionSelectedModel) => void;
  onLogTabToCheckout: (optionSelectedParams: OptionSelectedModel) => void;
}

export const useOptionActionService = ({
  cartMutateOptions,
  orderMutateOptions,
  seatOrderMutateOptions,
  onLogAddToCart: handleLogAddToCart,
  onLogTabToCheckout: handleLogTabToCheckout,
}: Props) => {
  const { goodsId, showRoomId } = useGoodsPageInfo();
  const { handleError } = useErrorService();

  // only MWeb
  const cart = useMutation<'ok', ErrorModel, SaveActionParam>(
    (saveParam) =>
      postCart({
        saveParam,
        goodsId,
      }),
    {
      onError: (error: ErrorModel) => {
        handleError({
          error,
        });
      },
    },
  );

  const order = useMutation<OrderSaveModel, ErrorModel, SaveActionParam>(
    (saveParam: SaveActionParam) =>
      postOrder({
        saveParam,
        goodsId,
      }),
    {
      onError: (error: ErrorModel) => {
        handleError({
          error,
        });
      },
    },
  );

  const seatOrder = useMutation<OrderSaveModel, ErrorModel, SeatSaveActionParam>(
    (saveParam: SeatSaveActionParam) =>
      postSeatOrder({
        saveParam,
        goodsId,
      }),
    {
      onError: (error: ErrorModel) => {
        handleError({
          error,
        });
      },
    },
  );

  const { mutate: executeDeleteExpired } = useMutation<unknown, ErrorModel, LayoutLockParams>(
    ({ layoutIds }) => deleteLayoutLock({ goodsId, layoutIds }),
    {
      onError: (error: ErrorModel) => {
        handleError({
          error,
        });
      },
    },
  );

  const handleActionSeatSave = (params: SeatActionSaveParams[]) => {
    const itemList = params.map((option) => {
      const { optionId, quantity, secondaryId } = option;

      return {
        optionId,
        quantity,
        secondaryId,
      };
    });

    const actionSaveParam = {
      itemList,
      showRoomId,
    };

    seatOrder.mutateAsync(actionSaveParam, seatOrderMutateOptions);
  };

  // only MWeb
  const handleActionSave = ({ type, params, logParams }: HandleActionSaveParam) => {
    if (type === OptionSaveActionType.SEAT_ORDER) {
      handleLogTabToCheckout(logParams);
      handleActionSeatSave(params as SeatActionSaveParams[]);

      return;
    }

    const itemList = params.map((option) => {
      const { optionId, quantity } = option;

      return {
        optionIdList: [optionId],
        quantity,
      };
    });

    const actionSaveParam = {
      itemList,
      showRoomId,
    };

    if (type === OptionSaveActionType.CART) {
      handleLogAddToCart(logParams);
      cart.mutateAsync(actionSaveParam, cartMutateOptions);
      return;
    }

    handleLogTabToCheckout(logParams);
    order.mutateAsync(actionSaveParam, orderMutateOptions);
  };

  const handleDeleteExpired = ({ layoutIds }: LayoutLockParams) => {
    executeDeleteExpired({ layoutIds });
  };

  return {
    handleActionSave,
    handleDeleteExpired,
  };
};
