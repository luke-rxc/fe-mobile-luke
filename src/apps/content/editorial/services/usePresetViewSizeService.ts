import { useCallback, useRef } from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';

/**
 * 뷰 사이즈 조회
 */
export const usePresetViewSizeService = () => {
  const { isApp } = useDeviceDetect();
  const viewElRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useCallback((el) => {
    if (!el) return;
    viewElRef.current = el;
  }, []);

  const handleGetViewSize = useCallback(() => {
    let viewSize = window.innerHeight;

    if (viewElRef.current && isApp) {
      const viewFakeRef = viewElRef.current.querySelector('.viewport');
      const viewFakeBottomRef = viewElRef.current.querySelector('.view-bottom');

      const viewHeight = viewFakeRef?.clientHeight || 0;
      const viewBottomSize = viewFakeBottomRef?.clientHeight || 0;

      viewSize = viewHeight - viewBottomSize;
    }
    return viewSize;
  }, [isApp]);

  return {
    viewRef,
    handleGetViewSize,
  };
};
