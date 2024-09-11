import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { useModal } from '@hooks/useModal';
import { AppLinkTypes } from '@constants/link';
import { CALL_WEB_EVENT_TYPE } from '@features/delivery/constants';
import { DeliveryListModalContainer } from '@features/delivery/containers';
import { createElement, useEffect } from 'react';
import { getAppLink } from '@utils/link';
import { ClaimReturnExchangeDetailModel, OrderCancelGoodsModel, toClaimReturnExchangeDetailModel } from '../models';
import { MYPAGE_CLAIM_DETAIL_QUERY_KEY } from '../constants';
import { getReturnExchangeDetail } from '../apis';
import { ReceiveActionType, ReceiveDataType } from '../types';
import { useLogService } from './useLogService';

interface ServiceParams {
  cancelOrReturnId?: string;
}

type ClaimDetailViewLogDefaultType = {
  goods_id: string[];
  goods_name: string[];
  option_id: string[];
  option_quantity: string[];
};

export const useClaimDetailService = ({ cancelOrReturnId }: ServiceParams) => {
  const { open, receiveValues, showToastMessage } = useWebInterface();
  const { LogMyOrderViewReturnOptionDetail, logMyOrderViewExchangeOptionDetail } = useLogService();
  const { openModal } = useModal();
  /**
   * 반품/교환 상세 정보 조회
   */
  const claimDetailQuery = useQuery(
    [MYPAGE_CLAIM_DETAIL_QUERY_KEY, cancelOrReturnId],
    () => getReturnExchangeDetail({ cancelOrReturnId }),
    {
      select: toClaimReturnExchangeDetailModel,
      cacheTime: 0,
    },
  );

  /** 배송지 변경 모달 활성화 */
  const showChangeShippingAddressModal = () => {
    open(
      {
        url: getAppLink(AppLinkTypes.MANAGE_DELIVERY_SELECTED),
        initialData: { type: CALL_WEB_EVENT_TYPE.ON_EXCHANGE_DETAIL_ENTRY_OPEN, id: cancelOrReturnId },
      },
      {
        doWeb: async () => {
          await openModal(
            {
              nonModalWrapper: true,
              render: (props) =>
                createElement(DeliveryListModalContainer, { selectable: true, disabledAction: true, ...props }),
            },
            { type: CALL_WEB_EVENT_TYPE.ON_EXCHANGE_DETAIL_ENTRY_OPEN, id: cancelOrReturnId },
          );
        },
      },
    );
  };

  /**
   * 배송지 수정 모달 등에서 전달 받은 receive 데이터 액션 처리 함수
   */
  const receiveActions = (actions: ReceiveActionType[]) => {
    actions.forEach(({ type, message }) => {
      switch (type) {
        case 'toast':
          showToastMessage({ message: message as string });
          break;
        case 'refetch':
          claimDetailQuery && claimDetailQuery.refetch();
          break;
        default:
          break;
      }
    });
  };

  const toClaimDetailViewLogItem = (items: ClaimReturnExchangeDetailModel) => {
    const toItemsLogModel = (data: OrderCancelGoodsModel[]) => {
      const defaultValue: ClaimDetailViewLogDefaultType = {
        goods_id: [],
        goods_name: [],
        option_id: [],
        option_quantity: [],
      };
      return (
        data?.reduce((acc, item) => {
          return {
            goods_id: acc.goods_id.concat(`${item.goodsId}`),
            goods_name: acc.goods_name.concat(item.goodsName),
            option_id: acc.option_id.concat(`${item.optionId}`),
            option_quantity: acc.option_quantity.concat(`${item.quantity}`),
          };
        }, defaultValue) ?? defaultValue
      );
    };

    const reduceData = toItemsLogModel(items.orderClaimGoods);
    return {
      order_id: `${items.orderId}`,
      goods_id: reduceData.goods_id,
      goods_name: reduceData.goods_name,
      option_id: reduceData.option_id,
      option_quantity: reduceData.option_quantity,
    };
  };

  useEffect(() => {
    (receiveValues as ReceiveDataType)?.actions && receiveActions(receiveValues.actions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  useEffect(() => {
    if (claimDetailQuery.data && claimDetailQuery.isSuccess) {
      const logParams = toClaimDetailViewLogItem(claimDetailQuery.data);
      // 반품/교환 상세 화면 진입 시 로그
      if (claimDetailQuery.data.type === 'RETURN') {
        LogMyOrderViewReturnOptionDetail({ ...logParams });
      } else {
        logMyOrderViewExchangeOptionDetail({ ...logParams });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimDetailQuery.data, claimDetailQuery.isSuccess]);

  return {
    claimDetailQuery,
    showChangeShippingAddressModal,
  };
};
