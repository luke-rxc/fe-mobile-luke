import { LiveReceipt01, LiveReceipt02, LiveReceipt03, LiveReceipt04, LiveReceipt05, LottieRef } from '@pui/lottie';
import { forwardRef, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface ReceiptLottieProps {
  randomIdx: number;
  play?: boolean;
  onComplete?: () => void;
}

export const ReceiptLottie = forwardRef<HTMLDivElement, ReceiptLottieProps>(
  ({ randomIdx, play = false, onComplete }, ref) => {
    const lottieArray = [LiveReceipt01, LiveReceipt02, LiveReceipt03, LiveReceipt04, LiveReceipt05];
    const lottieRef = useRef<LottieRef>(null);
    const lottieOptions = {
      loop: false,
      autoplay: false,
    };

    const ReceiptComponent = lottieArray[randomIdx];

    const handleComplete = () => {
      onComplete?.();
    };

    useEffect(() => {
      if (play) {
        lottieRef.current?.player?.play();
      }
    }, [play]);

    const addEvent = useCallback(() => {
      lottieRef.current && lottieRef.current.player?.addEventListener('complete', handleComplete);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const removeEvent = useCallback(() => {
      lottieRef.current && lottieRef.current.player?.removeEventListener('complete', handleComplete);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      addEvent();

      return () => {
        removeEvent();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Container ref={ref}>
        <ReceiptComponent ref={lottieRef} animationOptions={lottieOptions} />
      </Container>
    );
  },
);

const Container = styled.div`
  position: relative;
  & > div {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
  }
`;
