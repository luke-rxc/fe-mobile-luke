import styled from 'styled-components';
import { PageError, PageErrorProps } from '@features/exception/components';
import { useWebInterface } from '@hooks/useWebInterface';
import { getUniversalLink, getWebLink } from '@utils/link';
import { UniversalLinkTypes, WebLinkTypes } from '@constants/link';
import { useHistory } from 'react-router-dom';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useEffect } from 'react';
import { setSeatLockId } from '@features/seat/utils';
import { CALL_WEB_EVENT } from '@features/seat/constants/seat';
import { OrderCompleteErrorType } from '../../types';

export type OrderCompleteErrorProps = {
  type: OrderCompleteErrorType;
  message?: string;
  goodsCode?: string;
  checkoutId?: number;
  expiredDate?: number;
};

export const OrderCompleteError = ({ type, message, goodsCode, checkoutId, expiredDate }: OrderCompleteErrorProps) => {
  const history = useHistory();
  const { isApp } = useDeviceDetect();
  const { close, alert } = useWebInterface();

  const handleClose = () => {
    close(
      {},
      {
        doWeb: () => {
          const url = checkoutId
            ? getWebLink(WebLinkTypes.CHECKOUT, { checkoutId, ...(goodsCode && { goodsCode }) })
            : getWebLink(WebLinkTypes.CART);
          history.replace(url);
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const navigate = (...args: Parameters<typeof getUniversalLink>) => {
    const { app, web } = getUniversalLink(...args);

    if (isApp) {
      window.location.href = app;
      return;
    }

    history.replace(web);
  };

  const getPageErrorProps = (_type: OrderCompleteErrorType, _message = '', _goodsCode = ''): PageErrorProps => {
    switch (_type) {
      case OrderCompleteErrorType.USER_PAY_CANCEL:
        return {
          title: '결제를 취소했습니다',
          description: '다시 주문하려면 주문서로 이동해주세요',
          actionLabel: '주문서로 이동',
          onAction: handleClose,
        };
      case OrderCompleteErrorType.PAY_TIME_OUT:
        return {
          title: '결제 요청이 지연되고 있습니다',
          description: '주문 목록에서 다시 확인해주세요',
          actionLabel: '주문 목록으로 이동',
          onAction: () => {
            navigate(UniversalLinkTypes.ORDER_HISTORY);
          },
        };
      case OrderCompleteErrorType.OVER_ORDER_QUANTITY: {
        return {
          title: '결제가 완료되지 않았습니다',
          description: _message || '결제 수단의 한도 또는 기간 만료일을 확인해주세요',
          actionLabel: _goodsCode ? '상품 상세로 이동' : '쇼핑백으로 이동',
          onAction: () => {
            const args: Parameters<typeof getUniversalLink> = goodsCode
              ? [UniversalLinkTypes.GOODS, { goodsCode }]
              : [UniversalLinkTypes.CART];
            navigate(...args);
          },
        };
      }
      case OrderCompleteErrorType.LOCK_TIMEOUT: {
        return {
          title: '',
          description: '좌석 선점 시간이 종료되었습니다',
        };
      }
      case OrderCompleteErrorType.FAIL:
        return {
          title: '결제가 완료되지 않았습니다',
          description: _message || '결제 수단의 한도 또는 기간 만료일을 확인해주세요',
          actionLabel: '주문서로 이동',
          onAction: handleClose,
        };
      case OrderCompleteErrorType.NOT_FOUND:
        return {
          title: '',
          description: _message || '주문 건을 찾을 수 없습니다',
          actionLabel: '주문 목록으로 이동',
          onAction: () => {
            navigate(UniversalLinkTypes.ORDER_HISTORY);
          },
        };
      default:
        return {
          title: '',
          description: _message || '주문 건을 찾을 수 없습니다',
          actionLabel: '주문 목록으로 이동',
          onAction: () => {
            navigate(UniversalLinkTypes.ORDER_HISTORY);
          },
        };
    }
  };

  const props = getPageErrorProps(type, message, goodsCode);

  const handleLockTimeout = async () => {
    const params = {
      type: CALL_WEB_EVENT.ON_EXPIRED,
      data: {},
    };

    (await alert({ title: '좌석 선점 시간이 종료되었습니다', message: '다시 선택해주세요' })) &&
      close(params, {
        doWeb: () => {
          const args: Parameters<typeof getUniversalLink> = goodsCode
            ? [UniversalLinkTypes.GOODS, { goodsCode }]
            : [UniversalLinkTypes.CART];

          const { web } = getUniversalLink(...args);
          history.replace(web, params);
        },
      });
  };

  useEffect(() => {
    if (isApp) {
      return;
    }

    switch (type) {
      case OrderCompleteErrorType.LOCK_TIMEOUT: {
        handleLockTimeout();
        break;
      }
      case OrderCompleteErrorType.FAIL:
      case OrderCompleteErrorType.USER_PAY_CANCEL:
        checkoutId && expiredDate && setSeatLockId(checkoutId, expiredDate);
        break;
      default:
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, checkoutId, expiredDate]);

  return <PageErrorStyled {...props} isFull />;
};

const PageErrorStyled = styled(PageError)`
  &.is-full {
    height: 100%;
  }
`;
