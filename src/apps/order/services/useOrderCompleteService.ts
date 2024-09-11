import { UniversalLinkTypes } from '@constants/link';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useQuery } from '@hooks/useQuery';
import { useWebInterface } from '@hooks/useWebInterface';
import { getUniversalLink } from '@utils/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { clearSeatLockId } from '@features/seat/utils';
import { getOrder } from '../apis';
import { ORDER_POLLING_TIMEOUT, ORDER_RE_FETCH_INTERVAL } from '../constants';
import { OrderErrorData, toOrderModel } from '../models';
import { OrderStatus, OrderCompleteErrorType, CHECKOUT_TYPE } from '../types';
import { useOrderLogService } from './useLogService';
import { useOrderCompleteQueryService } from './useOrderCompleteQueryService';
import { SupportedPGResult, deleteOrderLoggingMark, verifyOrderLoggingMark } from '../utils';

export const useOrderCompleteService = () => {
  const history = useHistory();
  const { logTabToHome, logTabToOrderDetail, logCompleteOrder, logTabToInputForm } = useOrderLogService();
  const { isApp } = useDeviceDetect();
  const query = useOrderCompleteQueryService();
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState<OrderErrorData>();
  const timeoutMsRef = useRef<number>(0);
  const { purchase } = useWebInterface();
  const isShowBottomControl = query.type === CHECKOUT_TYPE.DEFAULT;
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: orderInfo,
    isLoading: isOrderLoading,
    isIdle,
  } = useQuery(['order', 'complete'], () => getOrder({ orderId: +query.orderId }), {
    select: toOrderModel,
    enabled,
    refetchInterval: enabled ? ORDER_RE_FETCH_INTERVAL : false,
    onSuccess: (res) => {
      const { orderStatus } = res;
      if (orderStatus === OrderStatus.LOADING) {
        const isPayTimeOut = Date.now() > timeoutMsRef.current;

        if (isPayTimeOut) {
          setError({ type: OrderCompleteErrorType.PAY_TIME_OUT });
        }

        return;
      }

      setEnabled(false);

      if (orderStatus === OrderStatus.ERROR) {
        const { error: err } = res;
        setError(err);
        purchase({ status: 'failure' });
        return;
      }

      purchase({
        status: 'success',
        goodsList: res.itemOptionList.map(({ goods: { code, id } }) => ({ goodsCode: code, goodsId: id })),
      });

      if (!isApp) {
        // 중복 로깅 방지
        if (verifyOrderLoggingMark(query.orderId)) {
          logCompleteOrder({ ...res.loggingData, auctionId: query.auctionId });
          deleteOrderLoggingMark();
        }
      } else {
        logCompleteOrder({ ...res.loggingData, auctionId: query.auctionId });
      }
    },
    onError: (e) => {
      setError({ type: OrderCompleteErrorType.API, message: e.data?.message });
      purchase({ status: 'failure' });
    },
    cacheTime: 0,
  });

  const navigate = useCallback(
    (...args: Parameters<typeof getUniversalLink>) => {
      const { app, web } = getUniversalLink(...args);

      if (isApp) {
        window.location.href = app;
        return;
      }

      history.replace(web);
    },
    [history, isApp],
  );

  const handleNavigate = useCallback(
    (link: UniversalLinkTypes) => {
      switch (link) {
        case UniversalLinkTypes.HOME:
          logTabToHome();
          navigate(UniversalLinkTypes.HOME);
          break;
        case UniversalLinkTypes.ORDER_DETAIL: {
          const { orderId } = query;
          const { type } = orderInfo?.action ?? { type: 'DEFAULT' };
          const section = type === 'DEFAULT' ? undefined : 'additionalInfo';
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          section === 'additionalInfo' ? logTabToInputForm() : logTabToOrderDetail();
          navigate(UniversalLinkTypes.ORDER_DETAIL, { orderId, ...(section && { section }) });
          break;
        }
        default:
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [logTabToHome, logTabToOrderDetail],
  );

  const polling = () => {
    timeoutMsRef.current = Date.now() + ORDER_POLLING_TIMEOUT;
    setEnabled(true);
    purchase({ status: 'request' });
  };

  const init = async () => {
    const { isFail, approve, isUserCancel } = SupportedPGResult[query.pgType](query);
    const isSuccess = !isFail() && (await approve());

    if (!isSuccess) {
      setError({ type: isUserCancel() ? OrderCompleteErrorType.USER_PAY_CANCEL : OrderCompleteErrorType.FAIL });
      return;
    }

    polling();
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isOrderLoading || orderInfo?.orderStatus === OrderStatus.LOADING) {
      setIsLoading(true);
      return;
    }

    // 0.5초 delay를 걸어 결제 진행중 화면을 사용자가 인식할 수 있도록 처리
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [isOrderLoading, orderInfo]);

  useEffect(() => {
    if (isApp || !query.expiredDate) {
      return;
    }

    if (orderInfo?.orderStatus !== OrderStatus.SUCCESS) {
      return;
    }

    clearSeatLockId();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderInfo, query.expiredDate]);

  return {
    orderInfo,
    isShowBottomControl,
    isLoading,
    error,
    isIdle,
    goodsCode: query.goodsCode,
    checkoutId: query.checkoutId,
    expiredDate: query.expiredDate,
    handleNavigate,
  };
};
