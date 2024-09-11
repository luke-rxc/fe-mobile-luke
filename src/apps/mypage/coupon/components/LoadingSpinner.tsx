/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useLoading } from '@hooks/useLoading';

/**
 * lifecycle(mount/didUnmount)에 따라 로딩 spinner를 show/hide
 */
export const LoadingSpinner = () => {
  const { showLoading, hideLoading } = useLoading();

  React.useEffect(() => {
    showLoading();
    return () => hideLoading();
  }, []);

  return null;
};
