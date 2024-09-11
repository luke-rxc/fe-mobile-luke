import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useWebInterface } from '@hooks/useWebInterface';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useLoadingSpinner } from '@hooks/useLoadingSpinner';
import { CALL_WEB_EVENT } from '@features/seat/constants';
import { LiveModel } from '@features/liveFloating/models';
import { emitClearReceiveValues } from '@utils/webInterface';
import { PageLoadStatus } from '../constants';
import { useGoodsPageInfo } from '../hooks';
import { GoodsModel, OptionModel } from '../models';

interface LoadingProps {
  isGoodsLoading: boolean;
  isCouponLoading: boolean;
  isWishInfoLoading: boolean;
  isLiveLoading: boolean;
  isContentListLoading: boolean;
  isNotificationInfoLoading: boolean;
}

interface ErrorProps {
  isGoodsError: boolean;
}

interface MethodsProps {
  historySaveMutate: (params: { goodsId: number; showRoomId: number }) => void;
  onOptionOpen: () => void;
  onLiveFloating: () => void;
  onCloseWebLiveFloating: () => void;
  onLogGoodsInit: (params: { detailGoods: GoodsModel; isCoupon: boolean }) => void;
}

interface DataProps {
  detailGoods?: GoodsModel;
  option?: OptionModel;
  isCoupon: boolean;
  live?: LiveModel;
  isFloatingLivePlayer: boolean;
}

interface Props {
  loading: LoadingProps;
  error: ErrorProps;
  methods: MethodsProps;
  data: DataProps;
}

export const useInitService = ({ loading, error, methods, data }: Props) => {
  const { isApp } = useDeviceDetect();
  const { receiveValues, showToastMessage } = useWebInterface();
  const { locationState, goodsId: reqGoodsId, showRoomId: reqShowRoomId, isInLivePage } = useGoodsPageInfo();

  const {
    isGoodsLoading,
    isCouponLoading,
    isWishInfoLoading,
    isLiveLoading,
    isContentListLoading,
    isNotificationInfoLoading,
  } = loading;
  const { isGoodsError } = error;
  const {
    historySaveMutate,
    onLogGoodsInit: handleLogGoodsInit,
    onOptionOpen: handleOptionOpen,
    onLiveFloating: handleLiveFloating,
    onCloseWebLiveFloating: handleCloseWebLiveFloating,
  } = methods;
  const { detailGoods, option, isCoupon, live, isFloatingLivePlayer } = data;

  // initialize State
  const [pageLoadState, setPageLoadState] = useState<PageLoadStatus>(PageLoadStatus.LOADING);
  const [isAutoOptionOpen, setIsAutoOptionOpen] = useState<boolean>(locationState?.type === CALL_WEB_EVENT.ON_EXPIRED);

  useLoadingSpinner(pageLoadState === PageLoadStatus.LOADING);

  /**
   * initialize 처리
   */
  useEffect(() => {
    if (isGoodsLoading) {
      setPageLoadState(PageLoadStatus.LOADING);
      return;
    }

    if (isGoodsError) {
      setPageLoadState(PageLoadStatus.ERROR);
      return;
    }

    if (isCouponLoading || isWishInfoLoading || isLiveLoading || isContentListLoading || isNotificationInfoLoading) {
      setPageLoadState(PageLoadStatus.LOADING);
      return;
    }

    setPageLoadState(PageLoadStatus.COMPLETE);

    /**
     * * 로드 이후 처리
     */
    if (detailGoods) {
      // history (최근 본 상품 저장)
      historySaveMutate({ goodsId: reqGoodsId, showRoomId: reqShowRoomId });

      // logging
      handleLogGoodsInit({ detailGoods, isCoupon });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isGoodsLoading,
    isCouponLoading,
    isWishInfoLoading,
    isLiveLoading,
    isContentListLoading,
    isNotificationInfoLoading,
    isGoodsError,
  ]);

  /**
   * 자동 옵션 모달 오픈
   */
  useEffect(() => {
    if (isEmpty(receiveValues)) {
      return;
    }

    // 1:1 문의 등록 완료시
    if (isApp && receiveValues?.type === 'registeredQnA') {
      showToastMessage({ message: '문의를 등록했습니다' });
    }

    setIsAutoOptionOpen(isApp && receiveValues?.type === CALL_WEB_EVENT.ON_EXPIRED);
    emitClearReceiveValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues]);

  useEffect(() => {
    if (pageLoadState !== PageLoadStatus.COMPLETE || !option || !isAutoOptionOpen) {
      return;
    }

    isAutoOptionOpen && handleOptionOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLoadState, option, isAutoOptionOpen]);

  /**
   * 라이브 Floatting
   */
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (pageLoadState === PageLoadStatus.COMPLETE && live && !isFloatingLivePlayer && !isInLivePage) {
      timeoutId = setTimeout(() => handleLiveFloating(), 1000);
    }

    return () => {
      clearTimeout(timeoutId);
      handleCloseWebLiveFloating();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, pageLoadState, isFloatingLivePlayer]);

  return {
    pageLoadState,
  };
};
