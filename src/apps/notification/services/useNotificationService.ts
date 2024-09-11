import { useLayoutEffect, useState } from 'react';
import { useInfiniteQuery } from '@hooks/useInfiniteQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { getNotifications } from '../apis';
import { NOTIFICATION_QUERY_KEY } from '../constants';
import { toNotificationsModel } from '../models';

type NotificationsServiceOptions = {
  enabled?: boolean;
};

export const useNotificationService = ({ enabled = true }: NotificationsServiceOptions = {}) => {
  // 알림 설정 배너 노출 여부
  const [showNotificationSettingBanner, setShowNotificationSettingBanner] = useState<boolean>(false);

  // 알림 설정 배너 관련 인터페이스
  const { pageActivatedCount, notificationStatus, openSystemService, signIn } = useWebInterface();

  // 알림 목록 조회
  const { data, error, isError, isLoading, isFetching, isFetched, isSuccess, hasNextPage, refetch, fetchNextPage } =
    useInfiniteQuery(NOTIFICATION_QUERY_KEY, ({ pageParam: nextParameter }) => getNotifications({ nextParameter }), {
      select: ({ pages, ...params }) => ({ pages: pages.flatMap(toNotificationsModel), ...params }),
      getNextPageParam: ({ nextParameter }) => nextParameter,
      cacheTime: 0,
      enabled,
    });

  // 알림 설정 상태 업데이트
  const updateNotificationSettingStatus = async () => {
    setShowNotificationSettingBanner(!(await notificationStatus()));
  };

  // 알림 설정 배너 클릭
  const handleClickNotificationSettingBanner = () => {
    openSystemService({ type: 'notificationSettings' });
  };

  // 로그인 버튼 클릭
  const handleClickLogin = async () => {
    (await signIn()) && refetch();
  };

  // 페이지 활성화시 알림 설정 상태를 업데이트
  useLayoutEffect(() => {
    updateNotificationSettingStatus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageActivatedCount]);

  return {
    showNotificationSettingBanner,
    handleClickNotificationSettingBanner,
    notifications: data?.pages,
    errorNotifications: error,
    isNotificationsError: isError,
    isNotificationsLoading: isLoading,
    isNotificationsFetching: isFetching,
    isNotificationsFetched: isFetched,
    isNotificationsSuccess: isSuccess,
    hasNotificationsNextPage: hasNextPage,
    handleLoadNotification: fetchNextPage,
    handleClickLogin,
  };
};
