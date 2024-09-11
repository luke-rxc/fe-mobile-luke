import { useErrorService } from '@features/exception/services';
import { useAuth } from '@hooks/useAuth';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useMutation } from '@hooks/useMutation';
import { useMwebToAppDialog } from '@hooks/useMwebToAppDialog';
import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDDay } from '@services/useDDay';
import { ErrorModel } from '@utils/api/createAxios';
import { salesNotificationUpdated, showLiveActivity } from '@utils/webInterface';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { AppPopupActionKind } from '@constants/mwebToAppDialog';
import { deleteNotification, getNotification, postNotification } from '../apis';
import { QueryKeys, ShowLiveActivityTime } from '../constants';
import { useGoodsPageInfo } from '../hooks';
import { GoodsModel } from '../models';

interface Props {
  detailGoods: GoodsModel | null;
  ddayProps: ReturnType<typeof useDDay>;
  onReload: () => void;
  onLogCompleteSalesNotificationIn: () => void;
  onLogCompleteSalesNotificationOut: () => void;
}

export const useNotificationService = ({
  detailGoods,
  ddayProps,
  onReload: handleReload,
  onLogCompleteSalesNotificationIn: handleLogCompleteSalesNotificationIn,
  onLogCompleteSalesNotificationOut: handleLogCompleteSalesNotificationOut,
}: Props) => {
  const { getIsLogin } = useAuth();
  const { isApp, isIOS } = useDeviceDetect();
  const { signIn, confirm, showToastMessage } = useWebInterface();
  const { openDialogToApp } = useMwebToAppDialog();
  const { goodsId, goodsPageId, deepLink } = useGoodsPageInfo();
  const queryClient = useQueryClient();
  const { handleError } = useErrorService();

  const [init, setInit] = useState<boolean>(false);
  // 판매 시작일 확인
  const [isOverStartDate, setIsOverStartDate] = useState<boolean>(false);

  const { remainDay, countDown } = ddayProps;

  // IOS: 판매까지 8시간 이내인 상품
  const isLiveActivity = isApp && isIOS && remainDay === 0 && countDown <= ShowLiveActivityTime;

  const {
    data: isNotification,
    isLoading: isNotificationInfoLoading,
    isError: isNotificationInfoError,
  } = useQuery([QueryKeys.NOTIFICATION, goodsId], () => getNotification({ goodsId }));

  const { isLoading: isNotificationLoading, mutateAsync: notificationMutateAsync } = useMutation(
    () => postNotification({ goodsId }),
    {
      onSuccess: () => {
        queryClient.setQueryData<boolean | undefined>([QueryKeys.NOTIFICATION, goodsId], () => {
          return true;
        });
        if (isApp) {
          inAppSalesNotificationUpdated(true);
          if (isLiveActivity) {
            inAppShowLiveActivity();
          }
        }
        handleLogCompleteSalesNotificationIn();
      },
      onError: (error: ErrorModel) => {
        handleError({ error });
      },
    },
  );

  const { isLoading: isUnNotificationLoading, mutateAsync: unNotificationMutateAsync } = useMutation(
    () => deleteNotification({ goodsId }),
    {
      onSuccess: () => {
        queryClient.setQueryData<boolean | undefined>([QueryKeys.NOTIFICATION, goodsId], () => {
          return false;
        });
        isApp && inAppSalesNotificationUpdated(false);
        handleLogCompleteSalesNotificationOut();
      },
      onError: (error: ErrorModel) => {
        handleError({ error });
      },
    },
  );

  const handleUpdateNotification = async () => {
    /**
     * 앱 유도 팝업
     */
    if (!isApp) {
      openDialogToApp(deepLink, {
        actionProps: {
          kind: AppPopupActionKind.GOODS_UPDATE_NOTIFY,
        },
      });
      return;
    }

    if (!getIsLogin()) {
      const signInResult = await signIn();
      if (signInResult) {
        handleReload();
        executeUpdateNotification();
      }
      return;
    }
    executeUpdateNotification();
  };

  const inAppSalesNotificationUpdated = (isOn: boolean) => {
    salesNotificationUpdated({
      goodsId,
      goodsCode: goodsPageId,
      isOn,
    });
  };

  const executeUpdateNotification = async () => {
    if (isNotificationInfoLoading || isNotificationLoading || isUnNotificationLoading) {
      return false;
    }

    if (isNotification) {
      const result = await confirm({ title: '알림을 해제하시겠습니까?' });

      if (result) {
        showToastMessage({ message: '알림을 해제했습니다' });
        unNotificationMutateAsync();
      }
    } else {
      showToastMessage({ message: '알림을 신청했습니다' });
      notificationMutateAsync();
    }
    return true;
  };

  const handleReloadNotification = () => {
    queryClient.invalidateQueries([QueryKeys.NOTIFICATION, goodsId]);
  };

  const inAppShowLiveActivity = () => {
    if (detailGoods) {
      const { name, primaryImage, salesStartDate } = detailGoods;

      showLiveActivity({
        type: 'GOODS',
        id: goodsId,
        title: name,
        imagePath: primaryImage.path,
        startDate: salesStartDate,
        deepLinkUrl: deepLink,
      });
    }
  };

  useEffect(() => {
    /**
     * 판매 예정 상품 알림 신청 완료  + 판매까지 8시간 이내인 상품
     * active: 판매 예정 상품 상세 페이지 진입시
     */
    if (!init && detailGoods && isNotification && isLiveActivity) {
      inAppShowLiveActivity();
      setInit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailGoods, isNotification, isLiveActivity]);

  /**
   * 판매 시작일이 도래했을 경우에도 알림 정보가 초기화 되지 않을 수 있는 이슈
   * 현재 시간과 판매 시작일을 비교하는 로직 추가
   */
  useEffect(() => {
    if (detailGoods) {
      const newDate = new Date().getTime();
      newDate >= detailGoods.salesStartDate && setIsOverStartDate(true);
    }
  }, [detailGoods]);

  return {
    /** 알림 상태 */
    isNotification: !!isNotification && !isOverStartDate,
    isNotificationInfoLoading,
    isNotificationInfoError,

    /** Active Notification */
    handleUpdateNotification,

    /** Reload Notification */
    handleReloadNotification,
  };
};
