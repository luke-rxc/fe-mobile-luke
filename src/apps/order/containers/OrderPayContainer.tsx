import { useCallback, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { SEO } from '@pui/seo';
import { useWebEvent } from '@hooks/useWebEvent';
import { useWebInterface } from '@hooks/useWebInterface';
import { userAgent } from '@utils/ua';
import qs from 'qs';
import toNumber from 'lodash/toNumber';
import { ORDER_COMPLETE_PATH } from '../constants';
import { usePayments } from '../hooks';
import { CHECKOUT_TYPE, PG_TYPE } from '../types';
import { useOrderLogService } from '../services';

const { isApp } = userAgent();
const NAVER_PAY = 'naverpay';

export const OrderPayContainer = () => {
  const { logViewCheckoutOnPG } = useOrderLogService();
  const { id: checkoutId } = useParams<{ id: string }>();
  const history = useHistory();
  const { init, pay } = usePayments();
  const { initialValues, alert, close, orderInfo } = useWebInterface();
  const { pageshow } = useWebEvent();
  const showAlert = useCallback(async (message: string) => alert({ message }), [alert]);
  // 중복 호출 방지
  const isAlreadyRequest = useRef(false);

  const callAppOrderInfo = (goodsIds: number[], goodsKind: string, seatExpiredDate?: number) => {
    goodsIds &&
      goodsKind &&
      orderInfo({
        ...(seatExpiredDate && { expiredDate: seatExpiredDate }),
        goodsIds,
        goodsKind,
        checkoutId: toNumber(checkoutId),
      });
  };

  /** @todo params 정확한 타입기재 필요 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requestPay = async (key: string, params: any) => {
    isAlreadyRequest.current = true;
    const {
      type = CHECKOUT_TYPE.DEFAULT,
      orderId,
      paymentGatewayParameter,
      auctionId,
      seatExpiredDate,
      goodsIdList,
      goodsKind,
    } = params;

    callAppOrderInfo(goodsIdList, goodsKind, seatExpiredDate);

    logViewCheckoutOnPG({
      orderId,
      paymentGatewayParameter,
    });

    await init(paymentGatewayParameter.pgType, key);

    pay({
      orderId,
      paymentGatewayParameter,
      type,
      ...(isApp && { appScheme: 'prizm://' }),
      ...(auctionId && { auctionId }),
    });
  };

  /**
   * 네이버페이 뒤로가기 예외처리
   */
  useEffect(() => {
    const { paymentGatewayParameter } = initialValues;
    if (!isEmpty(pageshow)) {
      if (paymentGatewayParameter?.payMethod === NAVER_PAY && window.history.length > 1) {
        // 결제 모듈 재실행 방지
        isAlreadyRequest.current = true;
        close();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageshow]);

  useEffect(() => {
    const checkValidOrder = async () => {
      if (!initialValues) {
        // 결제 파라미터 설정 오류 문구 노출
        if (await showAlert('결제 정보가 올바르지 않습니다')) {
          close();
        }
        return;
      }

      const { orderId, shopId, paymentGatewayParameter, type, auctionId } = initialValues;

      if (!orderId) {
        // 주문 id 오류 문구 노출
        if (await showAlert('주문번호가 존재하지 않습니다')) {
          close();
        }
        return;
      }

      // 전액 포인트 결제 or 프리즘 페이 결제시 주문 완료 페이지로 리다이렉팅
      if (!paymentGatewayParameter) {
        const queryParams = {
          type: type === CHECKOUT_TYPE.LIVE ? CHECKOUT_TYPE.LIVE : CHECKOUT_TYPE.DEFAULT,
          pg_type: PG_TYPE.PRIZM,
          ...(auctionId && { auction_id: auctionId }),
        };
        const url = `${ORDER_COMPLETE_PATH}/${orderId}?${qs.stringify(queryParams)}`;
        history.replace(url);
        return;
      }

      const isExecutable = paymentGatewayParameter && orderId && !isAlreadyRequest.current;

      if (isExecutable) {
        requestPay(shopId, initialValues);
      }
    };

    checkValidOrder();
    // eslint-disable-next-line
  }, [initialValues]);

  return (
    <SEO
      meta={[
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no',
        },
      ]}
    />
  );
};
