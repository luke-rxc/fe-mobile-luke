import { useLoadingStore } from '@stores/useLoadingStore';

/**
 * @deprecated zustand useLoadingStore 적용으로 인해, 기존 커스텀 훅 deprecated
 */
export const useLoading = () => {
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  return {
    showLoading,
    hideLoading,
  };
};
