import { FormProvider } from 'react-hook-form';
import { useLoading } from '@hooks/useLoading';
import { useEffect } from 'react';
import { PageError } from '@features/exception/components';
import { usePrizmPayService } from '../services';
import { PrizmPayRegisterContent } from '../components';
import { PRIZM_PAY_PAGE_LOAD_TYPE } from '../constants';

interface Props {
  prizmPayId?: number;
}

export const PrizmRegisterContainer = ({ prizmPayId }: Props) => {
  const { showLoading, hideLoading } = useLoading();
  const {
    pageLoad,
    isCreateLoading,
    isUpdateLoading,
    handleRetry,
    handleSubmit,
    method,
    isForceDefault,
    handleClickCardScan,
  } = usePrizmPayService(prizmPayId);

  useEffect(() => {
    if (pageLoad === PRIZM_PAY_PAGE_LOAD_TYPE.LOADING) {
      showLoading();
      return;
    }

    hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLoad]);

  if (pageLoad === PRIZM_PAY_PAGE_LOAD_TYPE.LOADING) {
    return null;
  }

  if (pageLoad === PRIZM_PAY_PAGE_LOAD_TYPE.NORMAL_ERROR) {
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
      <PrizmPayRegisterContent
        prizmPayId={prizmPayId}
        onSubmit={handleSubmit}
        onClickCardScan={handleClickCardScan}
        isShowDefault={!isForceDefault}
        isCreateLoading={isCreateLoading}
        isUpdateLoading={isUpdateLoading}
      />
    </FormProvider>
  );
};
