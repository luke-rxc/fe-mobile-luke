import { useQuery } from '@hooks/useQuery';
import { PageErrorProps } from '@features/exception/components';
import { useMemo } from 'react';
import { ErrorActionButtonLabel, ErrorTitle } from '@features/exception/constants';
import { useErrorService } from '@features/exception/services';
import { LiveStatus } from '@constants/live';
import { toLiveEndViewModel } from '../models';
import { liveInfoQueryKey } from '../constants';
import { getLiveInfo } from '../apis';

interface Props {
  liveId: number;
}

export const useLiveInfoService = ({ liveId }: Props) => {
  const {
    data: liveInfo,
    isLoading,
    isError,
    error: liveError,
  } = useQuery([liveInfoQueryKey, liveId], () => getLiveInfo(liveId), {
    select: (data) => {
      return toLiveEndViewModel(data);
    },
  });

  const {
    action: { handleErrorReloadCb, handleErrorHomeCb },
  } = useErrorService();

  /**
   * 에러 정보
   */
  const errorInfo: PageErrorProps | null = useMemo(() => {
    if (isError) {
      if (liveError?.data?.message) {
        return {
          description: liveError?.data?.message ?? null,
          actionLabel: ErrorActionButtonLabel.HOME,
          onAction: handleErrorHomeCb,
        } as PageErrorProps;
      }

      return {
        description: ErrorTitle.Network,
        actionLabel: ErrorActionButtonLabel.RELOAD,
        onAction: handleErrorReloadCb,
      } as PageErrorProps;
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, liveError, liveInfo]);

  return {
    liveInfo,
    isLoading,
    isError,
    isNotEnded: liveInfo ? liveInfo.liveStatus !== LiveStatus.END : false,
    errorInfo,
  };
};
