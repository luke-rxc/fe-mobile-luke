import { useQuery } from '@hooks/useQuery';
import { PageErrorProps } from '@features/exception/components';
import { useEffect, useMemo } from 'react';
import { ErrorActionButtonLabel, ErrorTitle } from '@features/exception/constants';
import { useErrorService } from '@features/exception/services';
import { GoodsCardProps } from '@pui/goodsCard';
import { LiveStatus } from '@constants/live';
import { toLiveViewGoodsModel } from '../models';
import { liveInfoQueryKey } from '../constants';
import { getLiveInfo } from '../apis';
import { ReturnTypeUseLiveGoodsLogService } from './useLogService';

interface Props {
  liveId: number;
  logService: ReturnTypeUseLiveGoodsLogService;
}

export type ReturnTypeUseLiveGoodsService = ReturnType<typeof useLiveGoodsService>;

/**
 * 라이브 상품 관련 service
 */
export const useLiveGoodsService = ({ liveId, logService }: Props) => {
  const {
    logLiveGoodsViewPage: handleLogLiveGoodsViewPage,
    logLiveGoodsImpressionGoods: handleLogLiveGoodsImpressionGoods,
    logLiveGoodsTabGoods: handleLogLiveGoodsTabGoods,
  } = logService;

  const {
    data: liveInfo,
    isLoading,
    isError,
    error: liveError,
  } = useQuery([liveInfoQueryKey, liveId], () => getLiveInfo(liveId), {
    select: (data) => {
      return toLiveViewGoodsModel(data);
    },
  });

  const {
    action: { handleErrorReloadCb, handleErrorHomeCb },
  } = useErrorService();

  useEffect(() => {
    if (liveInfo && liveInfo.liveStatus === LiveStatus.END) {
      handleLogLiveGoodsViewPage(liveId);
      if (liveInfo.goodsList.length > 0) {
        handleLogLiveGoodsImpressionGoods(liveId, liveInfo.goodsList);
      }
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

  const handleClickGoodsThumbnail = (goods: GoodsCardProps, index: number) => {
    handleLogLiveGoodsTabGoods(liveId, { ...goods, goodsIndex: index + 1 });
  };

  return {
    liveInfo,
    isLoading,
    isError,
    errorInfo,
    goodsListProps: {
      goodsList: liveInfo?.goodsList || [],
      handleClickGoodsThumbnail,
    },
  };
};
