import styled, { createGlobalStyle } from 'styled-components';
import { useWebInterface } from '@hooks/useWebInterface';
import { createElement, useCallback, useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import { useLoading } from '@hooks/useLoading';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { toAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';
import { useModal } from '@hooks/useModal';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { PageError } from '@features/exception/components';
import { Button } from '@pui/button';
import { useChangeShippingService, useDeliveryService } from '../services';
import { DeliveryList } from '../components/DeliveryList';
import { CALL_WEB_EVENT_TYPE, DELIVERY_PAGE_LOAD_TYPE } from '../constants';
import { DrawerDeliveryRegisterContainer } from './DrawerDeliveryRegisterContainer';
import { DeliveryModel } from '../models';

interface Props {
  selectable?: boolean;
  disabledAction?: boolean;
  className?: string;
}

export const DeliveryListContainer = styled(({ selectable = false, disabledAction = false, className }: Props) => {
  const { showLoading, hideLoading } = useLoading();
  const { isApp } = useDeviceDetect();
  const { openModal } = useModal();
  const { initialValues, receiveValues, showToastMessage, setTopBar } = useWebInterface();
  const [isAuctionEntry, setIsAuctionEntry] = useState(false);
  const {
    deliveryList,
    pageLoad,
    refetchShippingList,
    showAlert,
    handleActions: onActions,
    handleRetry,
    handleComplete,
    isFetched,
    logViewDelivery,
    logAddShippingAddress,
    logEditShippingAddress,
  } = useDeliveryService();

  // 주문상세, 교환 배송지 변경
  const { handleChangeOrderShippingInfo, handleExchangeShippingInfo, handleExchangeDetailShippingInfo } =
    useChangeShippingService();

  const openDeliveryRegister = (deliveryId?: number) => {
    openModal({
      nonModalWrapper: true,
      render: (props) => createElement(DrawerDeliveryRegisterContainer, { ...props, deliveryId }),
    });
  };

  const handleCreate = useCallback(async () => {
    if ((deliveryList ?? []).length >= 20) {
      await showAlert('배송지는 최대 20개까지 등록할 수 있습니다');
      return;
    }

    if (isApp) {
      toAppLink(AppLinkTypes.MANAGE_DELIVERY_REGISTER);
      return;
    }

    openDeliveryRegister();
    // eslint-disable-next-line
  }, [history, isApp, deliveryList]);

  const handleActions = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>, shippingId: number) => {
      if (e.target.value === 'update') {
        if (isApp) {
          toAppLink(AppLinkTypes.MANAGE_DELIVERY_EDIT, { shippingId });
        } else {
          openDeliveryRegister(shippingId);
        }
      } else {
        await onActions(e, shippingId);
      }
    },
    // eslint-disable-next-line
    [],
  );

  /** 배송지 변경 */
  const handleConfirm = useCallback(
    async (shipping: DeliveryModel) => {
      const { id, type } = initialValues;
      // 교환 요청 배송지 변경
      if (type === CALL_WEB_EVENT_TYPE.ON_EXCHANGE_REQUEST_ENTRY_OPEN) {
        handleExchangeShippingInfo({ ...pick(shipping, ['address', 'addressDetail', 'name', 'phone', 'postCode']) });
        return;
      }
      // 교환 상세 배송지 변경
      if (type === CALL_WEB_EVENT_TYPE.ON_EXCHANGE_DETAIL_ENTRY_OPEN && id) {
        handleExchangeDetailShippingInfo({
          cancelOrReturnId: id,
          recipient: { ...pick(shipping, ['address', 'addressDetail', 'name', 'phone', 'postCode']) },
        });
        return;
      }
      // 주문 상세 변경
      handleChangeOrderShippingInfo({
        orderId: id,
        ...pick(shipping, ['address', 'addressDetail', 'name', 'phone', 'postCode']),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialValues],
  );

  useHeaderDispatch({
    type: 'mweb',
    enabled: true,
    quickMenus: ['cart', 'menu'],
    title: '배송지 관리',
  });

  useEffect(() => {
    if (pageLoad === DELIVERY_PAGE_LOAD_TYPE.LOADING) {
      showLoading();
      return;
    }

    hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLoad]);

  useEffect(() => {
    if (!isEmpty(receiveValues)) {
      const { type, data } = receiveValues;
      if (type === CALL_WEB_EVENT_TYPE.ON_DELIVERY_CLOSE) {
        const { message, action } = data;
        refetchShippingList();
        showToastMessage({ message });

        if (action === 'add') {
          logAddShippingAddress();
        }

        if (action === 'edit') {
          logEditShippingAddress();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveValues, refetchShippingList]);

  useEffect(() => {
    if (isApp && !isEmpty(initialValues)) {
      const { type } = initialValues;

      if (type === CALL_WEB_EVENT_TYPE.ON_AUCTION_ENTRY_OPEN) {
        setIsAuctionEntry(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  useEffect(() => {
    if (isAuctionEntry) {
      setTopBar({
        title: '배송지 정보',
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuctionEntry]);

  useEffect(() => {
    if (isFetched) {
      logViewDelivery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

  if (pageLoad === DELIVERY_PAGE_LOAD_TYPE.LOADING) {
    return null;
  }
  if (pageLoad === DELIVERY_PAGE_LOAD_TYPE.NORMAL_ERROR) {
    const normalExceptionProps = {
      isFull: true,
      title: '일시적인 오류가 발생하였습니다',
      description: '잠시 후 다시 시도해주세요',
      actionLabel: '다시 시도',
      onAction: handleRetry,
    };

    return <PageError {...normalExceptionProps} />;
  }

  if (deliveryList.length === 0) {
    return (
      <PageError
        isFull
        title="등록된 배송지가 없습니다"
        description="배송지를 등록하고 간편하게 주문해보세요"
        actionLabel="배송지 등록"
        onAction={handleCreate}
      />
    );
  }

  return (
    <>
      {isAuctionEntry && <GlobalStyle />}
      <div className={className}>
        <DeliveryList
          items={deliveryList}
          orderId={initialValues?.orderId}
          onActions={handleActions}
          onCreate={handleCreate}
          onConfirm={handleConfirm}
          selectable={selectable}
          disabledAction={disabledAction}
          isAuctionEntry={isAuctionEntry}
        />
        {isAuctionEntry && (
          <div className="button-wrapper">
            <Button bold block variant="primary" size="large" onClick={handleComplete}>
              완료
            </Button>
          </div>
        )}
      </div>
    </>
  );
})`
  box-sizing: border-box;
  width: 100%;

  .button-wrapper {
    position: fixed;
    ${({ theme }) => theme.mixin.safeArea('bottom', 24)};
    padding: 0 2.4rem;
    width: 100%;
    z-index: 1;
  }
`;

const GlobalStyle = createGlobalStyle`
  html {
    height: 100vh;
  }
`;
