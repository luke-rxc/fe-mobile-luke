import { useCallback, useRef } from 'react';
import { useMutation } from '@hooks/useMutation';
import { useWebInterface } from '@hooks/useWebInterface';
import { useAuth } from '@hooks/useAuth';
import { postContentEvent } from '../apis';

/**
 * 컨텐츠 내 공통 이벤트를 처리하기 위한 서비스
 */
export const useContentEventService = () => {
  const { getIsLogin } = useAuth();
  const { signIn, alert } = useWebInterface();
  const code = useRef<string>('');

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
    code.current = eventCode;

    if (!getIsLogin()) {
      const signInResult = await signIn();
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
