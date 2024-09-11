import { useEffect, useState } from 'react';
import { LiveHeaderAnimationStatus } from '../constants';

interface Props {
  usedAnimation: boolean;
  isLiveMode: boolean;
}

/**
 * 라이브 헤더 animation hook
 */
export const useLiveHeaderAnimation = ({ usedAnimation, isLiveMode }: Props) => {
  const [animationStatus, setAnimationStatus] = useState<LiveHeaderAnimationStatus>(
    !isLiveMode ? LiveHeaderAnimationStatus.INIT : LiveHeaderAnimationStatus.END,
  );

  useEffect(() => {
    if (isLiveMode) {
      if (usedAnimation) {
        setAnimationStatus(LiveHeaderAnimationStatus.FIXED);
        setTimeout(() => setAnimationStatus(LiveHeaderAnimationStatus.RUNNING), 1000);
      } else {
        setAnimationStatus(LiveHeaderAnimationStatus.FIXED);
      }
    }
  }, [usedAnimation, isLiveMode]);

  const handleAnimateEnd = () => {
    if (!usedAnimation) {
      return;
    }
    if (animationStatus !== LiveHeaderAnimationStatus.END && animationStatus !== LiveHeaderAnimationStatus.FIXED) {
      setAnimationStatus(LiveHeaderAnimationStatus.END);
      setTimeout(() => setAnimationStatus(LiveHeaderAnimationStatus.RUNNING), 10000);
    }
  };

  return { animationStatus, handleAnimateEnd };
};
