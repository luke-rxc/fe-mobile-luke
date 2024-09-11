import { useMutation } from '@hooks/useMutation';
import { useQuery } from '@hooks/useQuery';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWebInterface } from '@hooks/useWebInterface';
import { useModal } from '@hooks/useModal';
import { useQueryClient } from 'react-query';
import { useAuth } from '@hooks/useAuth';
import { GenerateHapticFeedbackType } from '@constants/webInterface';
import { CardFormFields, CARD_FIELDS, toBannerModel, toPrizmPayListModel, toPrizmPayModel } from '../models';
import {
  createPrizmPay,
  deletePrizmPay,
  getUserPrizmPayList,
  getUserPrizmPay,
  updatePrizmPay,
  updatePrizmPayDefault,
  getPayReRegistrationBannerList,
} from '../apis';
import { CALL_WEB_EVENT, PrizmPayPageLoadType, PRIZM_PAY_PAGE_LOAD_TYPE } from '../constants';
import { useLogService } from './useLogService';

export const usePrizmPayService = (prizmPayId?: number) => {
  const queryClient = useQueryClient();
  const method = useForm<CardFormFields>({
    defaultValues: CARD_FIELDS,
    mode: 'onChange',
  });
  const { getValues, handleSubmit, setValue, setError } = method;
  const { close, showToastMessage, confirm, alert, prizmPayUpdated, generateHapticFeedback } = useWebInterface();
  const { logViewPrizmPay, logAddPrizmPay, logEditCardAlias, logEditDefault, logRemovePrizmPay, logTabScanCard } =
    useLogService();
  const [pageLoad, setPageLoad] = useState<PrizmPayPageLoadType>(PRIZM_PAY_PAGE_LOAD_TYPE.LOADING);
  const { closeModal } = useModal();
  const { userInfo, refetchUserInfo } = useAuth();

  const {
    data: payList,
    refetch: refetchPayList,
    isFetched,
    isLoading: isPayListLoading,
    isError: isPayListError,
  } = useQuery(['prizmPay'], () => getUserPrizmPayList({}), {
    select: (res) => toPrizmPayListModel(res.content),
    cacheTime: 0,
    onError: (err) => {
      showToast(err?.data?.message ?? '카드 목록을 불러오는 도중 오류가 발생하였습니다');
    },
  });

  const { data: bannerList } = useQuery(['checkout', 'pay-banner'], () => getPayReRegistrationBannerList(), {
    select: (res) => res.bannerList.map(toBannerModel),
    enabled: userInfo?.isPrizmPayReRegistrationRequired,
  });

  const isForceDefault = userInfo?.isPrizmPayReRegistrationRequired || (payList ?? []).length === 0;

  const {
    data: payDetail,
    isLoading: isPayLoading,
    isError: isPayError,
    refetch: refetchPay,
  } = useQuery(
    ['prizmPay', prizmPayId],
    () => {
      return prizmPayId
        ? getUserPrizmPay({ id: prizmPayId })
        : Promise.reject(new Error('카드 정보 불러올 수 없습니다'));
    },
    {
      select: toPrizmPayModel,
      enabled: !!prizmPayId,
      onError: (err) => {
        showToast(err?.data?.message ?? '카드 정보를 불러오는 도중 오류가 발생하였습니다');
      },
    },
  );

  const { mutateAsync: executeCreate, isLoading: isCreateLoading } = useMutation(
    () => {
      const {
        birth,
        alias: cardAlias,
        cardNo: cardNumber,
        mmYY: expiry,
        pass2word: pwd2digit,
        isDefault,
      } = getValues();
      const param = {
        birth,
        cardAlias,
        cardNumber,
        expiry,
        pwd2digit,
        isDefault: isDefault || isForceDefault,
      };

      return createPrizmPay(param);
    },
    {
      onError: (err) => {
        generateHapticFeedback({ type: GenerateHapticFeedbackType.Error });

        if (!err.data?.errors || err.data?.errors.length === 0) {
          showAlert(err?.data?.message ?? '카드를 등록하는 도중 오류가 발생하였습니다');
        } else {
          err.data?.errors.forEach(({ field, reason: message }) => {
            if (field) {
              const name = convertToFormName(field);

              if (name === '') {
                showAlert(err?.data?.message ?? '카드를 등록하는 도중 오류가 발생하였습니다');
              } else {
                setError(name, { type: 'manual', message });
              }
            }
          });
        }
      },
    },
  );

  const { mutateAsync: executeUpdate, isLoading: isUpdateLoading } = useMutation(
    (id: number) => {
      const { alias: cardAlias } = getValues();
      const param = {
        cardAlias,
      };
      return updatePrizmPay({ id, param });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['prizmPay', prizmPayId]);
      },
      onError: (err) => {
        showToast(err?.data?.message ?? '카드별명을 수정하는 도중 오류가 발생하였습니다');
      },
    },
  );

  const { mutateAsync: executeUpdateDefault } = useMutation(
    (id: number) => {
      return updatePrizmPayDefault(id);
    },
    {
      onSuccess: () => {
        showToastMessage({ message: '주 결제 카드로 설정했습니다' });
        logEditDefault();
      },
      onError: (err) => {
        showToastMessage({ message: err?.data?.message ?? '주 결제 카드를 설정하는 도중 오류가 발생하였습니다' });
      },
    },
  );

  const { mutateAsync: executeDelete } = useMutation(
    (id: number) => {
      return deletePrizmPay({ id });
    },
    {
      onError: (err) => {
        showToastMessage({ message: err?.data?.message ?? '카드를 삭제하는 도중 오류가 발생하였습니다' });
      },
    },
  );

  async function onSubmit() {
    const pay = prizmPayId ? await executeUpdate(prizmPayId) : await executeCreate();
    const action = prizmPayId ? 'edit' : 'add';

    const params = {
      type: CALL_WEB_EVENT.ON_PAY_CLOSE,
      data: {
        pay: toPrizmPayModel(pay),
        message: prizmPayId ? '카드 별명을 설정했습니다' : '카드를 등록했습니다',
        action,
      },
    };

    if (action === 'add') {
      prizmPayUpdated(
        {
          status: 'added',
        },
        {
          doWeb: () => {
            refetchUserInfo();
          },
        },
      );
      generateHapticFeedback({ type: GenerateHapticFeedbackType.Success });
    }

    close(params, {
      doWeb: () => {
        closeModal('', params);
      },
    });
  }

  const handleActions = async (e: React.ChangeEvent<HTMLSelectElement>, payId: number) => {
    if (e.target.value === 'default') {
      await executeUpdateDefault(payId);
      refetchPayList();

      prizmPayUpdated({
        status: 'edited',
      });
    }

    if (e.target.value === 'delete') {
      await handleDelete(payId);
      refetchPayList();
    }
  };

  const handleDelete = async (payId: number) => {
    const confirmTitle = '카드를 삭제할까요?';

    generateHapticFeedback({ type: GenerateHapticFeedbackType.Confirm });

    if (await showConfirm('', confirmTitle)) {
      await executeDelete(payId);
      showToastMessage({ message: '카드를 삭제했습니다' });
      logRemovePrizmPay();

      prizmPayUpdated(
        {
          status: 'removed',
        },
        {
          doWeb: () => {
            refetchUserInfo();
          },
        },
      );
    }
  };

  const handleComplete = useCallback(() => {
    close({
      type: CALL_WEB_EVENT.ON_PAY_CLOSE,
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
    refetchPayList();

    if (prizmPayId) {
      refetchPay();
    }
  }, [refetchPayList, refetchPay, prizmPayId]);

  useEffect(() => {
    if (payDetail) {
      setValue('alias', payDetail.cardAlias ?? '');
    }
    // eslint-disable-next-line
  }, [payDetail]);

  useEffect(() => {
    if (isPayListLoading || isPayLoading) {
      setPageLoad(PRIZM_PAY_PAGE_LOAD_TYPE.LOADING);
      return;
    }

    if (isPayListError || isPayError) {
      setPageLoad(PRIZM_PAY_PAGE_LOAD_TYPE.NORMAL_ERROR);
      return;
    }

    setPageLoad(PRIZM_PAY_PAGE_LOAD_TYPE.SUCCESS);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPayListLoading, isPayListError, isPayLoading, isPayError]);

  return {
    payList: payList ?? [],
    pageLoad,
    method,
    isFetched,
    isLoading: isPayListLoading || isPayLoading,
    isCreateLoading,
    isUpdateLoading,
    isForceDefault,
    bannerList: bannerList ?? [],
    refetchPayList,
    handleSubmit: handleSubmit(onSubmit),
    handleActions,
    handleRetry,
    logViewPrizmPay,
    logAddPrizmPay,
    logEditCardAlias,
    logEditDefault,
    logRemovePrizmPay,
    showAlert,
    handleComplete,
    handleClickCardScan: logTabScanCard,
  };
};

function convertToFormName(field: string) {
  switch (field) {
    case 'validExpiry':
      return 'mmYY';
    case 'validBirth':
      return 'birth';
    default:
      return '';
  }
}
