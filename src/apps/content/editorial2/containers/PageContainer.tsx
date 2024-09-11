import { useEffect } from 'react';
import { PageError } from '@features/exception/components';
import { ErrorActionButtonLabel, ErrorMessage } from '@features/exception/constants';
import { useErrorService } from '@features/exception/services';
import { useLoadingStore } from '@stores/useLoadingStore';
import { ContentErrorHeader } from '../components';
import { usePageViewService } from '../services';
import { ContentContainer } from './ContentContainer';

export const PageContainer = () => {
  const { data, isShowSpinner, isValidPage } = usePageViewService();
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);
  const {
    action: { handleErrorHomeCb },
  } = useErrorService();

  useEffect(() => {
    if (isShowSpinner) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowSpinner]);

  /** Loading 처리 */
  if (isShowSpinner) {
    return <></>;
  }

  if (!isValidPage) {
    return (
      <>
        <ContentErrorHeader />
        <PageError
          description={ErrorMessage.NotFound}
          actionLabel={ErrorActionButtonLabel.HOME}
          onAction={handleErrorHomeCb}
        />
      </>
    );
  }

  if (isValidPage && data) {
    return <ContentContainer content={data} />;
  }
  return <></>;
};
