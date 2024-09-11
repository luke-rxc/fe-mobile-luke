import { useQuery } from '@hooks/useQuery';
import { useQueryClient } from 'react-query';
import { useEffect, useState } from 'react';
import { LiveFaqQueryKeys } from '../constants';
import { getLiveFaqList } from '../apis';
import { toLiveFaqListModel } from '../models';
import { useFaqLogService } from './useLogService';

interface Props {
  liveId: number;
  enabled?: boolean;
  openCallbackFunc?: () => void;
  closeCallbackFunc?: () => void;
}

export const useLiveFaqService = ({ liveId, enabled = true, openCallbackFunc, closeCallbackFunc }: Props) => {
  const [initialize, setInitialize] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { logLiveTabFaq, logLiveViewFaq, logLiveTabFaqSection } = useFaqLogService();

  useEffect(() => {
    if (!initialize && enabled) {
      setTimeout(() => {
        setInitialize(true);
      }, 700);
    }

    if (!enabled) {
      setInitialize(false);
    }
  }, [initialize, enabled]);

  useEffect(() => {
    return () => {
      setInitialize(false);
    };
  }, []);

  const {
    data: faqList,
    isFetched,
    isLoading,
    isError,
    error,
  } = useQuery([LiveFaqQueryKeys, liveId], () => getLiveFaqList(liveId), {
    select: (data) => toLiveFaqListModel(data),
    cacheTime: 0,
    refetchOnMount: true,
    enabled,
  });

  const handleOpen = () => {
    logLiveTabFaq(liveId);
    openCallbackFunc?.();
    logLiveViewFaq(liveId, (faqList || []).length);
    queryClient.invalidateQueries([LiveFaqQueryKeys, liveId]);
  };

  const handleClose = () => {
    closeCallbackFunc?.();
  };

  const handleClickFaqItem = (faqId: number, title: string, index: number) => {
    logLiveTabFaqSection(liveId, faqId, title, index);
  };

  return {
    faqList,
    error,
    isFetched,
    isLoading: isLoading || !initialize,
    isError,
    handleOpen,
    handleClose,
    handleClickFaqItem,
  };
};
