import styled from 'styled-components';
import React, { useCallback, useEffect, useRef } from 'react';
import { createDebug } from '@utils/debug';
import { useCustomEvent } from '../hooks/useCustomEvent';
import { ReceiptLottie } from './ReceiptLottie';
import { LIVE_PURCHASE_VERIFICATION_EVENT_NAME } from '../constants';
import { useLivePurchaseVerificationStore } from '../store';

interface Props {
  show: boolean;
}

const debug = createDebug();

/**
 * ReactionArea component
 */
export const ReactionArea = React.memo(({ show }: Props) => {
  const purchaseVerificationList = useLivePurchaseVerificationStore((state) => state.purchaseVerificationList);
  const pushItem = useLivePurchaseVerificationStore((state) => state.pushItem);
  const moveItem = useLivePurchaseVerificationStore((state) => state.moveItem);
  const updateItem = useLivePurchaseVerificationStore((state) => state.updateItem);
  const getLastLottieNum = useLivePurchaseVerificationStore((state) => state.getLastLottieNum);

  const { subscribe, unsubscribe } = useCustomEvent<string>();
  const containerRef = useRef<HTMLDivElement>(null);

  const isCustomEvent = (event: Event): event is CustomEvent => {
    return 'detail' in event;
  };

  const handleTrigger = useCallback(
    (event: Event) => {
      if (isCustomEvent(event)) {
        const prevIdx = getLastLottieNum();
        let randomNum = Math.floor(Math.random() * 5);
        debug.log('push', event.detail, prevIdx, randomNum);

        // 이전에 실행된 Lottie 파일과 겹치지 않도록 함
        if (randomNum === prevIdx) {
          if (prevIdx < 4) {
            randomNum += 1;
          } else {
            randomNum -= 1;
          }
        }

        pushItem({ id: event.detail, lottieNum: randomNum, ended: false });
      }
    },
    [getLastLottieNum, pushItem],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      moveItem();
    }, 700);

    return () => {
      clearInterval(timer);
    };
  }, [moveItem]);

  useEffect(() => {
    subscribe(LIVE_PURCHASE_VERIFICATION_EVENT_NAME, handleTrigger);

    return () => {
      unsubscribe(LIVE_PURCHASE_VERIFICATION_EVENT_NAME, handleTrigger);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleTrigger]);

  const handleComplete = (id: string) => {
    updateItem(id);
    containerRef.current?.removeChild(containerRef.current.children[0]);
  };

  return (
    <WrapperStyled $show={show} ref={containerRef}>
      {purchaseVerificationList.map(({ id, lottieNum }, index) => {
        const key = `purchaseVerificationItem-${index}-${id}-${lottieNum}`;
        return <ReceiptLottie key={key} randomIdx={lottieNum} play onComplete={() => handleComplete(id)} />;
      })}
    </WrapperStyled>
  );
});

const WrapperStyled = styled.div<{ $show: boolean }>`
  ${({ theme }) => theme.mixin.absolute({ r: 0 })}
  width: 9.6rem;
  height: 25.6rem;
  z-index: 10;
  opacity: ${({ $show }) => ($show ? '1' : '0')};
  transition: opacity 0.2s;
  ${({ theme }) => theme.mixin.safeArea('bottom', 80 + 56)};
  pointer-events: none;
`;
