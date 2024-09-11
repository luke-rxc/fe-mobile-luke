import { useLoadingStore } from '@stores/useLoadingStore';
import { useEffect } from 'react';

/**
 * useLoadingSpinner
 * 로딩 처리를 위한 hook
 */
export const useLoadingSpinner = (loading: boolean) => {
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  useEffect(() => {
    if (loading) {
      showLoading();
    } else {
      hideLoading();
    }

    return () => {
      hideLoading();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return loading;
};
