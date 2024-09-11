import { v4 as uuid } from 'uuid';
import { Firework } from '@pui/lottie';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FireworkLottie } from './FireworkLottie';
import { fireworkDuration } from '../constants';

interface FireworkLottiesProps {
  offsetWidth: number;
}

export const FireworkLotties = styled(({ offsetWidth }: FireworkLottiesProps) => {
  const [lotties, setLotties] = useState<ReturnType<typeof Firework>[]>([]);
  const lottieTimeRef = useRef<NodeJS.Timeout | null>(null);
  // 바로 전 x축 위치(곂치지 않기 위해서), 초기값은 사용하지 않는 수로 설정
  const prevXAxisRef = useRef<number>(-1);

  const handleComplete = () => {
    setLotties((prev) => prev.slice(1));
  };

  const createFireworkLottie = (time: number) => {
    lottieTimeRef.current = setTimeout(() => {
      // random duration
      const durationIdx = Math.floor(Math.random() * 4);
      // 70 ~ 150% 사이 랜덤 사이즈
      let size = Math.random() * (1.5 - 0.7) + 0.7;
      // 0 ~ 100%까지의 X축을 10등분해서 랜덤하게 위치
      let xAxis = Math.floor(Math.random() * 10) * 0.1;
      // 시작점으로부터 남은 width (기준 rem)
      let restWidth = (offsetWidth * (1 - xAxis)) / 10;

      // 전과 같은 위치에서 시작하거나 폭죽의 크기가 범위를 벗어날 경우 다시 계산
      // 10 * size => 10은 폭죽 기본 width size
      while (prevXAxisRef.current === xAxis || restWidth < 10 * size) {
        size = Math.random() * (1.5 - 0.7) + 0.7;
        xAxis = Math.floor(Math.random() * 10) * 0.1;
        restWidth = (offsetWidth * (1 - xAxis)) / 10;
      }

      prevXAxisRef.current = xAxis;
      setLotties((prev) => {
        if (prev.length < 3) {
          return [...prev, <FireworkLottie key={uuid()} size={size} xAxis={xAxis * 100} onComplete={handleComplete} />];
        }
        return prev;
      });

      createFireworkLottie(fireworkDuration[durationIdx]);
    }, time);
  };

  useEffect(() => {
    if (offsetWidth) {
      const durationIdx = Math.floor(Math.random() * 4);

      createFireworkLottie(fireworkDuration[durationIdx]);
    }

    return () => {
      lottieTimeRef.current && clearTimeout(lottieTimeRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offsetWidth]);

  return <>{lotties}</>;
})`
  pointer-events: none;
`;
