import { useEffect, useState } from 'react';
import { ReturnTypeUseLiveLogService } from '../services/useLogService';

interface Props {
  updateLiveViewPauseTime: ReturnTypeUseLiveLogService['updateLiveViewPauseTime'];
}

/**
 * 스트림 video time tracker
 * video 멈춤시간 계산하기 위한 hook
 */
export const useStreamVideoTimeTracker = ({ updateLiveViewPauseTime }: Props) => {
  const [pauseStartTime, setPauseStartTime] = useState<number>(0);

  useEffect(() => {
    return () => {
      setPauseStartTime(0);
    };
  }, []);

  const handlePauseVideo = () => {
    const startTime = new Date().getTime();
    setPauseStartTime(startTime);
  };

  const handlePlayVideo = () => {
    const diffTime = new Date().getTime() - pauseStartTime;
    updateLiveViewPauseTime(diffTime);
    setPauseStartTime(0);
    return diffTime / 1000;
  };

  return { pauseStartTime, handlePauseVideo, handlePlayVideo };
};
