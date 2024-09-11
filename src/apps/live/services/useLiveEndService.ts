import { useQuery } from '@hooks/useQuery';
import { PageErrorProps } from '@features/exception/components';
import { useEffect, useMemo } from 'react';
import { ErrorActionButtonLabel, ErrorTitle } from '@features/exception/constants';
import { useErrorService } from '@features/exception/services';
import { LiveStatus } from '@constants/live';
import { useLink } from '@hooks/useLink';
import { UniversalLinkTypes } from '@constants/link';
import { useHistory } from 'react-router-dom';
import { LiveGoodsCardSmallModel, toLiveEndViewModel } from '../models';
import { liveInfoQueryKey } from '../constants';
import { getLiveInfo } from '../apis';
import { ReturnTypeUseLiveEndLogService } from './useLogService';

interface Props {
  liveId: number;
  logService: ReturnTypeUseLiveEndLogService;
}

export type ReturnTypeUseLiveEndService = ReturnType<typeof useLiveEndService>;

export const useLiveEndService = ({ liveId, logService }: Props) => {
  const {
    logLiveViewEndpage: handleLogLiveViewEndpage,
    logLiveImpressionEndpageGoodsThumbnail: handleLogLiveImpressionEndpageGoodsThumbnail,
    logLiveTabEndpageGoodsThumbnail: handleLogLiveTabEndpageGoodsThumbnail,
    logLiveTabEndpageGoodsMore: handleLogLiveTabEndpageGoodsMore,
    logLiveTabEndpageCtaGotoshowroom: handleLogLiveTabEndpageCtaGotoshowroom,
  } = logService;

  const { getLink } = useLink();
  const history = useHistory();

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

  useEffect(() => {
    if (liveInfo && liveInfo.liveStatus === LiveStatus.END) {
      handleLogLiveViewEndpage(liveInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveInfo]);

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

  const handleImpressGoodsThumbnail = ({ id, goodsName, goodsType }: LiveGoodsCardSmallModel, index: number) => {
    handleLogLiveImpressionEndpageGoodsThumbnail({
      contentsId: liveId.toString(),
      goodsId: id,
      goodsName,
      goodsType,
      goodsIndex: index,
    });
  };

  const handleClickGoodsThumbnail = ({ id, goodsName, goodsType }: LiveGoodsCardSmallModel, index: number) => {
    handleLogLiveTabEndpageGoodsThumbnail({
      contentsId: liveId.toString(),
      goodsId: id,
      goodsName,
      goodsType,
      goodsIndex: index,
    });
  };

  const handleClickGoodsMore = () => {
    handleLogLiveTabEndpageGoodsMore();
  };

  const handleClickShowroom = () => {
    handleLogLiveTabEndpageCtaGotoshowroom();

    history.push(getLink(UniversalLinkTypes.SHOWROOM, { showroomCode: liveInfo?.showRoom?.code || '' }));
  };

  return {
    liveInfo,
    isLoading,
    isError,
    isNotEnded: liveInfo ? liveInfo.liveStatus !== LiveStatus.END : false,
    errorInfo,
    showroom: liveInfo?.showRoom,
    hasDownloadableCoupon: liveInfo?.hasDownloadableCoupon || false,
    goodsListProps: {
      goodsList: liveInfo?.goodsList || [],
      handleImpressGoodsThumbnail,
      handleClickGoodsThumbnail,
    },
    goodsMoreProps: {
      goodsMoreLink: (liveInfo?.goodsList || []).length > 3 ? `/live/${liveId}/goods` : null,
      handleClickGoodsMore,
    },
    showroomProps: {
      handleClickShowroom,
    },
  };
};
