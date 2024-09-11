import { ErrorModel } from '@utils/api/createAxios';
import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import { useModal } from '@hooks/useModal';
import { updateExchangeShippingInfo, updateOrderShippingInfo, UpdateOrderShippingInfoRequestParam } from '../apis';
import { useLogService } from './useLogService';

/**
 * 배송지 변경 Service
 */
export const useChangeShippingService = () => {
  const { close, showToastMessage } = useWebInterface();
  const { logEditOrderShippingAddress } = useLogService();
  const { isModalView, closeModal } = useModal();

  /**
   * 주문 상세 배송지 변경 Service
   */
  const { mutateAsync: handleChangeOrderShippingInfo } = useMutation<
    string,
    ErrorModel,
    UpdateOrderShippingInfoRequestParam
  >(updateOrderShippingInfo, {
    onSuccess: () => {
      logEditOrderShippingAddress();
      close(
        { actions: [{ type: 'refetch' }, { type: 'toast', message: '배송지를 변경했습니다' }] },
        // web
        {
          doWeb: () => {
            isModalView() &&
              closeModal('', {
                actions: [{ type: 'refetch' }, { type: 'toast', message: '배송지를 변경했습니다' }],
              });
          },
        },
      );
    },
    onError: (error: ErrorModel) => {
      // @todo 에러케이스에 대한 노출 정의 필요
      error.data?.message &&
        showToastMessage({ message: error.data?.message }, { autoDismiss: 2000, direction: 'bottom' });
    },
  });

  interface ExchangeShippingInfo {
    name: string;
    phone: string;
    address: string;
    addressDetail: string | null;
    postCode: string;
  }
  /**
   * 취교반 교환 요청 배송지 변경
   */
  const handleExchangeShippingInfo = (recipient: ExchangeShippingInfo) => {
    close(
      {
        actions: [
          { type: 'modify', data: recipient },
          { type: 'toast', message: '배송지를 변경했습니다' },
        ],
      },
      // web
      {
        doWeb: () => {
          isModalView() &&
            closeModal('', {
              actions: [
                { type: 'modify', data: recipient },
                { type: 'toast', message: '배송지를 변경했습니다' },
              ],
            });
        },
      },
    );
  };

  /**
   * 취교반 교환 상세 배송지 변경 Service
   */
  const { mutateAsync: handleExchangeDetailShippingInfo } = useMutation(updateExchangeShippingInfo, {
    onSuccess: () => {
      close(
        { actions: [{ type: 'refetch' }, { type: 'toast', message: '배송지를 변경했습니다' }] },
        // web
        {
          doWeb: () => {
            isModalView() &&
              closeModal('', {
                actions: [{ type: 'refetch' }, { type: 'toast', message: '배송지를 변경했습니다' }],
              });
          },
        },
      );
    },
    onError: (error) => {
      error.data?.message &&
        showToastMessage({ message: error.data?.message }, { autoDismiss: 2000, direction: 'bottom' });
    },
  });

  return {
    handleChangeOrderShippingInfo,
    handleExchangeShippingInfo,
    handleExchangeDetailShippingInfo,
  };
};
