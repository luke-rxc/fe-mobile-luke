import { useToastStore } from '@stores/useToastStore';

/**
 * @deprecated zustand useToastStore 적용으로 인해, 기존 커스텀 훅 deprecated
 */
export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);
  const removeToast = useToastStore((state) => state.removeToast);
  const removeAllToast = useToastStore((state) => state.removeAllToast);

  return {
    addToast,
    removeToast,
    removeAllToast,
  };
};
