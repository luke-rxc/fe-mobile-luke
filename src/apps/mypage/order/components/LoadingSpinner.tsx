/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useLoadingStore } from '@stores/useLoadingStore';

/**
 * lifecycle(mount/didUnmount)에 따라 로딩 spinner를 show/hide
 */
export const LoadingSpinner = () => {
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  React.useEffect(() => {
    showLoading();
    return () => hideLoading();
  }, []);

  return null;
};
