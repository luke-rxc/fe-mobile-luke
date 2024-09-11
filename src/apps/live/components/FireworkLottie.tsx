import { LottieRef, Firework, LottieProps as FireworkProps } from '@pui/lottie';
import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { fireworkColor } from '../constants';

interface FireworkLottieProps extends Omit<FireworkProps, 'lottieData'> {
  size: number;
  xAxis: number;
  onComplete: () => void;
}

export const FireworkLottie = styled(({ size, xAxis, onComplete: handleComplete, ...props }: FireworkLottieProps) => {
  const lottiePlay = useRef<LottieRef>(null);
  const colorIdx = Math.floor(Math.random() * 4);

  const addEvent = useCallback(() => {
    lottiePlay.current && lottiePlay.current.player?.addEventListener('complete', handleComplete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeEvent = useCallback(() => {
    lottiePlay.current && lottiePlay.current.player?.removeEventListener('complete', handleComplete);
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
    <Firework
      ref={lottiePlay}
      width={`${10 * size}rem`}
      height={`${15 * size}rem`}
      lottieColor={fireworkColor[colorIdx]}
      animationOptions={{ loop: false }}
      {...props}
    />
  );
})`
  ${({ theme, xAxis }) => theme.mixin.absolute({ b: 0, l: `${xAxis}%` })};

  & *[fill] {
    fill: ${({ lottieColor }) => lottieColor};
  }
  & *[stroke] {
    stroke: ${({ lottieColor }) => lottieColor};
  }
`;
