import { useCallback, useEffect } from 'react';
import { LiveFnbModel } from '../models';
import { useLiveFnbStore } from '../store';
import { useCustomEvent } from './useCustomEvent';
import { LIVE_FNB_EVENT_NAME } from '../constants';

interface Props {
  fnb: LiveFnbModel | undefined;
}

/**
 * 라이브 FNB custom hook
 */
export const useLiveFnb = ({ fnb }: Props) => {
  const { subscribe, unsubscribe } = useCustomEvent<string>();
  const showFaq = useLiveFnbStore((state) => state.showFaq);
  const updateShowFaq = useLiveFnbStore((state) => state.updateShowFaq);
  const updateHideFaq = useLiveFnbStore((state) => state.updateHideFaq);
  const initialShowFaq = useLiveFnbStore((state) => state.initialShowFaq);

  const isCustomEvent = (event: Event): event is CustomEvent => {
    return 'detail' in event;
  };

  const handleTrigger = useCallback(
    (event: Event) => {
      if (isCustomEvent(event)) {
        const action = event.detail;

        switch (action) {
          case 'show':
            updateShowFaq(!showFaq ? 'showing' : '');
            break;
          case 'hide':
            updateHideFaq(showFaq ? 'hiding' : '');
            setTimeout(() => {
              initialShowFaq(false);
            }, 500);
            break;

          default:
            break;
        }
      }
    },
    [initialShowFaq, showFaq, updateHideFaq, updateShowFaq],
  );

  useEffect(() => {
    if (!fnb) {
      return;
    }

    initialShowFaq(fnb.showFaq);
  }, [fnb, fnb?.showFaq, initialShowFaq]);

  useEffect(() => {
    subscribe(LIVE_FNB_EVENT_NAME, handleTrigger);

    return () => {
      unsubscribe(LIVE_FNB_EVENT_NAME, handleTrigger);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleTrigger]);

  return { showFaq };
};
