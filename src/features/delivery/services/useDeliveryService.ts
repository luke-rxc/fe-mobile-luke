/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useForm } from 'react-hook-form';
import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';
import { useCallback, useEffect, useState } from 'react';
import { useWebInterface } from '@hooks/useWebInterface';
import { useModal } from '@hooks/useModal';
import { useQueryClient } from 'react-query';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { toDeliveryItemModel, toDeliveryListModel, DeliveryFormFields } from '../models';
import {
  createDelivery,
  deleteDelivery,
  getDeliveryItem,
  getDeliveryList,
  updateDelivery,
  updateShippingDefault,
} from '../apis';
import { CALL_WEB_EVENT_TYPE, DeliveryPageLoadType, DELIVERY_PAGE_LOAD_TYPE } from '../constants';
import { useLogService } from './useLogService';

export const useDeliveryService = (deliveryId?: number) => {
  const queryClient = useQueryClient();
  const { logViewDelivery, logAddShippingAddress, logEditShippingAddress, logEditDefault, logRemoveShippingAddress } =
    useLogService();
  const { confirm, shippingAddressUpdated, generateHapticFeedback } = useWebInterface();
  const method = useForm<DeliveryFormFields>({
    defaultValues: {
      isDefault: false,
      addressName: '',
      address: '',
      addressDetail: '',
      name: '',
      phone: '',
      postCode: '',
    },
    mode: 'onChange',
  });
  const [pageLoad, setPageLoad] = useState<DeliveryPageLoadType>(DELIVERY_PAGE_LOAD_TYPE.LOADING);

  const { getValues, handleSubmit, setValue, trigger, setError } = method;
  const { alert, close, showToastMessage } = useWebInterface();
  const { closeModal } = useModal();

  const {
    data: deliveryList,
    refetch: refetchShippingList,
    isFetched,
    isLoading: isDeliveryListLoading,
    isError: isDeliveryListError,
  } = useQuery(['user', 'delivery'], () => getDeliveryList({}), {
    select: toDeliveryListModel,
    onError: (err) => {
      showToast(err?.data?.message ?? '배송지 목록을 불러오는 중에 오류가 발생하였습니다');
    },
  });

  const {
    data: deliveryItem,
    isLoading: isDeliveryLoading,
    isError: isDeliveryError,
    refetch: refetchDelivery,
  } = useQuery(['user', 'delivery', deliveryId], () => getDeliveryItem({ shippingId: deliveryId ?? -1 }), {
    select: toDeliveryItemModel,
    enabled: !!deliveryId,
    onError: (err) => {
      showToast(err?.data?.message ?? '배송지 정보를 불러오는 중에 오류가 발생하였습니다');
    },
  });

  const { mutateAsync: executeRegister, isLoading: isRegisterLoading } = useMutation(
    () => {
      const [addressName, address, addressDetail, isDefault, name, phone, postCode] = getValues([
        'addressName',
        'address',
        'addressDetail',
        'isDefault',
        'name',
        'phone',
        'postCode',
      ]);
      return createDelivery({
        params: { addressName, address, addressDetail, isDefault, name, phone: phone.replace(/[-]/g, ''), postCode },
      });
    },
    {
      onSuccess: () => {
        refetchShippingList();
      },
      onError: (err) => {
        if (err.data?.errors || err.data?.errors?.length === 0) {
          showToast(err?.data?.message ?? '배송지를 등록하는 도중 오류가 발생하였습니다');
        } else {
          err.data?.errors.forEach(({ field, reason: message }) => {
            if (field) {
              const name = field as keyof DeliveryFormFields;
              setError(name, { type: 'manual', message });
            }
          });
        }
      },
    },
  );

  const { mutateAsync: executeUpdate, isLoading: isUpdateLoading } = useMutation(
    (shippingId: number) => {
      const { addressName, address, addressDetail, isDefault, name, phone, postCode } = getValues();
      return updateDelivery({
        shippingId,
        params: { addressName, address, addressDetail, isDefault, name, phone: phone.replace(/[-]/g, ''), postCode },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user', 'delivery', deliveryId]);
      },
      onError: (err) => {
        if (!err.data?.errors) {
          showToast(err?.data?.message ?? '배송지를 수정하는 도중 오류가 발생하였습니다');
        } else {
          err.data?.errors.forEach(({ field, reason: message }) => {
            if (field) {
              const name = field as keyof DeliveryFormFields;
              setError(name, { type: 'manual', message });
            }
          });
        }
      },
    },
  );
  const { mutateAsync: executeUpdateDefault } = useMutation(
    (shippingId: number) => {
      return updateShippingDefault(shippingId);
    },
    {
      onSuccess: () => {
        showToast('기본 배송지로 설정했습니다');
        refetchShippingList();
        shippingAddressUpdated({
          status: 'edited',
        });
      },
      onError: (err) => {
        showToast(err?.data?.message ?? '기본 배송지로 설정하는 도중 오류가 발생하였습니다');
      },
    },
  );

  const { mutateAsync: executeDelete } = useMutation(
    (shippingId: number) => {
      return deleteDelivery(shippingId);
    },
    {
      onError: (err) => {
        showToast(err?.data?.message ?? '배송지를 삭제하는 도중 오류가 발생하였습니다');
      },
    },
  );

  const onSubmit = async () => {
    const delivery = deliveryId ? await executeUpdate(deliveryId) : await executeRegister();
    const action = deliveryId ? 'edit' : 'add';

    const params = {
      type: CALL_WEB_EVENT_TYPE.ON_DELIVERY_CLOSE,
      data: {
        delivery,
        action,
        message: deliveryId ? '배송지를 수정했습니다' : '배송지를 등록했습니다',
      },
    };

    if (action === 'add') {
      shippingAddressUpdated({
        status: 'added',
      });
      generateHapticFeedback({ type: GenerateHapticFeedbackType.Success });
    } else {
      shippingAddressUpdated({
        status: 'edited',
      });
    }

    close(params, {
      doWeb: () => {
        closeModal('', params);
      },
    });
  };

  const handleDelete = async (shippingId: number) => {
    const confirmTitle = '배송지를 삭제할까요?';

    generateHapticFeedback({ type: GenerateHapticFeedbackType.Confirm });

    if (await showConfirm('', confirmTitle)) {
      await executeDelete(shippingId);
      showToast('배송지를 삭제했습니다');

      shippingAddressUpdated({
        status: 'removed',
      });
    }
  };

  const handleAddressChange = useCallback(
    (address: { code: string; addr: string }) => {
      setValue('postCode', address.code);
      setValue('address', address.addr);
    },
    [setValue],
  );

  const handleActions = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>, shippingId: number) => {
      if (e.target.value === 'default') {
        await executeUpdateDefault(shippingId);
        logEditDefault();
        refetchShippingList();

        shippingAddressUpdated({
          status: 'edited',
        });
      }

      if (e.target.value === 'delete') {
        await handleDelete(shippingId);
        logRemoveShippingAddress();
        refetchShippingList();
      }
    },
    // eslint-disable-next-line
    [],
  );

  const handleComplete = useCallback(() => {
    close({
      type: CALL_WEB_EVENT_TYPE.ON_DELIVERY_CLOSE,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAlert = useCallback(
    async (message: string, title?: string) => {
      const isOK = await alert({ message, ...(title && { title }) });
      return isOK;
    },
    [alert],
  );

  const showConfirm = useCallback(
    async (message: string, title?: string) => {
      return confirm(title ? { title, message } : { title: message });
    },
    [confirm],
  );

  const showToast = useCallback(
    async (message: string) => {
      return showToastMessage({ message });
    },
    [showToastMessage],
  );

  const handleRetry = useCallback(() => {
    refetchShippingList();

    if (deliveryId) {
      refetchDelivery();
    }
  }, [refetchShippingList, refetchDelivery, deliveryId]);

  useEffect(() => {
    if (deliveryItem) {
      setValue('isDefault', deliveryItem.isDefault);
      setValue('address', deliveryItem.address);
      setValue('addressDetail', deliveryItem.addressDetail);
      setValue('name', deliveryItem.name);
      setValue('phone', deliveryItem.phone);
      setValue('postCode', deliveryItem.postCode);
      trigger();
    }
  }, [deliveryItem, setValue, trigger]);

  useEffect(() => {
    if (isDeliveryListLoading || isDeliveryLoading) {
      setPageLoad(DELIVERY_PAGE_LOAD_TYPE.LOADING);
      return;
    }

    if (isDeliveryListError || isDeliveryError) {
      setPageLoad(DELIVERY_PAGE_LOAD_TYPE.NORMAL_ERROR);
      return;
    }

    setPageLoad(DELIVERY_PAGE_LOAD_TYPE.SUCCESS);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeliveryListLoading, isDeliveryListError, isDeliveryLoading, isDeliveryError]);

  return {
    method,
    deliveryList: deliveryList?.content ?? [],
    deliveryItem,
    pageLoad,
    isFetched,
    isRegisterLoading,
    isUpdateLoading,
    handleSubmit: handleSubmit(onSubmit),
    handleDelete,
    handleAddressChange,
    refetchShippingList,
    handleActions,
    handleRetry,
    logViewDelivery,
    logAddShippingAddress,
    logEditShippingAddress,
    handleComplete,
    showAlert,
  };
};
