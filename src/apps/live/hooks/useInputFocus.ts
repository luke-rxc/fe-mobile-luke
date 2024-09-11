import { useCallback, useEffect, useState } from 'react';
import { enabledBodyScroll, disabledBodyScroll } from '@utils/bodyScroll';
import { useDeviceDetect } from '@hooks/useDeviceDetect';

export type ReturnTypeUseInputFocus = ReturnType<typeof useInputFocus>;

interface Props {
  toMessageScrollBottom: () => void;
  handleUpdateEllipsisCancel: () => void;
}

/**
 * input focus 관련 hook
 */
export const useInputFocus = ({ toMessageScrollBottom, handleUpdateEllipsisCancel }: Props) => {
  const { isIOS } = useDeviceDetect();
  const [focused, setFocused] = useState<boolean>(false);
  // 초기 innerHeight
  const [initialInnerHeight, setInitialInnerHeight] = useState<number>(0);

  const handleFocus = (e?: React.FocusEvent<HTMLDivElement>) => {
    e?.stopPropagation();
    setFocused(true);
    disabledBodyScroll();
    handleUpdateEllipsisCancel();
    setTimeout(() => toMessageScrollBottom(), 500);
  };

  const handleBlur = useCallback(() => {
    if (!focused) {
      return;
    }

    setFocused(false);
    enabledBodyScroll();
  }, [focused]);

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden' && focused) {
      handleBlur();
    }
  };

  const handleResize = useCallback(() => {
    if (focused && (window.visualViewport?.height ?? 0) >= initialInnerHeight) {
      handleBlur();
    }
  }, [focused, handleBlur, initialInnerHeight]);

  useEffect(() => {
    window.visualViewport?.addEventListener('resize', handleResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    setInitialInnerHeight(window.innerHeight);
    document.addEventListener('visibilitychange', handleVisibilityChange, false);

    return () => {
      handleBlur();
      setInitialInnerHeight(0);
      document.removeEventListener('visibilitychange', handleVisibilityChange, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    focused,
    initialInnerHeight: !isIOS && focused ? initialInnerHeight : null,
    focusedInnerHeight: !isIOS && focused ? window.innerHeight : null,
    handleFocus,
    handleBlur,
  };
};
