import { useCallback } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import { postContentEvent } from '../apis';
import { useContentStoreService } from './useContentStoreService';

/**
 * 컨텐츠 내 공통 이벤트를 처리하기 위한 서비스
 */
export const useContentEventService = () => {
  const { getIsLogin } = useAuth();
  const { alert } = useWebInterface();
  const { handleSignIn } = useContentStoreService();

  const { mutate: contentEventMutate } = useMutation((eventCode: string) => postContentEvent(eventCode), {
    onSuccess: () => {
      const msg = '키오스크에서 추첨하실 수 있습니다';
      alert({ message: msg });
    },
    onError: (error) => {
      alert({ message: error.data?.message ?? '' });
    },
  });

  const handleContentEvent = useCallback(async ({ eventCode }: { eventCode: string }) => {
    if (!getIsLogin()) {
      const signInResult = await handleSignIn();
      if (signInResult) {
        contentEventMutate(eventCode);
      }
      return;
    }

    contentEventMutate(eventCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    handleContentEvent,
  };
};
