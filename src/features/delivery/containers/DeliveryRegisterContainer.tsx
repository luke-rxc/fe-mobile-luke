import styled from 'styled-components';
import { FormProvider } from 'react-hook-form';
import { useLoading } from '@hooks/useLoading';
import { useEffect, useRef, useState } from 'react';
import { useWebInterface } from '@hooks/useWebInterface';
import isEmpty from 'lodash/isEmpty';
import { PageError } from '@features/exception/components';
import { useDeliveryService } from '../services';
import { DeliveryRegisterForm } from '../components';
import { CALL_WEB_EVENT_TYPE, DELIVERY_PAGE_LOAD_TYPE } from '../constants';
import { phoneNumberToString } from '../utils';

interface Props {
  deliveryId?: number;
}

export const DeliveryRegisterContainer = ({ deliveryId }: Props) => {
  const { showLoading, hideLoading } = useLoading();
  const { initialValues } = useWebInterface();
  const {
    method,
    handleAddressChange,
    handleSubmit,
    deliveryItem,
    pageLoad,
    deliveryList,
    isRegisterLoading,
    isUpdateLoading,
    handleRetry,
  } = useDeliveryService(deliveryId);
  const [isShowSyncOrderer, setIsShowSyncOrderer] = useState(false);
  const syncOrderer = useRef<() => void>(() => {});

  const handleSyncOrdererChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    if (checked) {
      syncOrderer.current();
    } else {
      method.reset(
        {
          ...method.getValues(),
          name: '',
          phone: '',
        },
        { keepErrors: true, keepTouched: true },
      );
    }
  };

  useEffect(() => {
    if (pageLoad === DELIVERY_PAGE_LOAD_TYPE.LOADING) {
      showLoading();
      return;
    }

    hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLoad]);

  useEffect(() => {
    if (!isEmpty(initialValues)) {
      const { type, data } = initialValues;

      if (type === CALL_WEB_EVENT_TYPE.ON_DELIVERY_ORDERER_SYNC) {
        if (data && data.name && data.phone) {
          syncOrderer.current = () => {
            method.setValue('name', data.name || '', { shouldValidate: true });
            method.setValue('phone', phoneNumberToString(data.phone || ''), { shouldValidate: true });
            window.requestAnimationFrame(() => {
              method.trigger(['name', 'phone']);
            });
          };

          setIsShowSyncOrderer(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

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

  return (
    <FormProvider {...method}>
      <ContainerStyled>
        <DeliveryRegisterForm
          item={deliveryItem}
          isShowDefault={!(deliveryList.length === 0 || deliveryItem?.isDefault)}
          isFirst={deliveryList.length === 0}
          isRegisterLoading={isRegisterLoading}
          isUpdateLoading={isUpdateLoading}
          isShowSyncOrderer={isShowSyncOrderer}
          onSubmit={handleSubmit}
          onAddressChange={handleAddressChange}
          onSyncOrdererChange={handleSyncOrdererChange}
        />
      </ContainerStyled>
    </FormProvider>
  );
};

const ContainerStyled = styled.div`
  width: 100%;
  padding-top: 1.2rem;
`;
