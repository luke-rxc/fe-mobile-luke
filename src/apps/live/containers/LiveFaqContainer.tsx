import { useEffect } from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { NotFound, PageError } from '@features/exception/components';
import { FaqList } from '../components';
import { useFaqLogService, useLiveFaqService } from '../services';

interface Props {
  liveId: number;
}
export const LiveFaqContainer = ({ liveId }: Props) => {
  const { isApp } = useDeviceDetect();
  const { faqList, isFetched, isLoading, isError, error, handleClickFaqItem } = useLiveFaqService({ liveId });
  const { logLiveViewFaq } = useFaqLogService();

  if (!isApp) {
    return <NotFound />;
  }

  if (isError) {
    return <PageError isFull error={error} />;
  }

  useEffect(() => {
    if (!isFetched) {
      return;
    }

    logLiveViewFaq(liveId, (faqList || []).length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

  return <FaqList items={faqList} isApp isLoading={isLoading} onClickItem={handleClickFaqItem} />;
};
