/**
 * DrawerV2 를 구동, open 체크하기 위한 Hook
 */

import { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

interface Props {
  firstDrawerBaseIndex: number;
}

const MobileWebHash = '#none';
export const useDrawer = (props?: Props) => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const { firstDrawerBaseIndex = 1 } = props ?? {};
  const mwebTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getIsFirstDrawer = () => {
    const $floating = document.getElementById('floating-root') as HTMLDivElement;
    return !($floating.querySelectorAll('[aria-label=drawer].open').length > firstDrawerBaseIndex);
  };

  const openAddress = () => {
    if (!getIsFirstDrawer()) {
      return;
    }

    window.location.href = MobileWebHash;
  };

  const clearAddress = () => {
    if (!getIsFirstDrawer() || !(window.location.hash === MobileWebHash)) {
      return;
    }

    history.replace({ ...history.location, hash: '' });
  };

  const clearMwebTimeout = () => {
    if (!mwebTimeoutRef.current) {
      return;
    }
    clearTimeout(mwebTimeoutRef.current);
    mwebTimeoutRef.current = null;
  };

  const drawerConditionOpen = () => {
    mwebTimeoutRef.current = setTimeout(() => {
      window.requestAnimationFrame(() => {
        setOpen(true);
      });
    }, 450);
  };

  const drawerOpen = () => {
    if (open) {
      return;
    }
    openAddress();
    clearMwebTimeout();
    drawerConditionOpen();
  };

  const drawerClose = () => {
    clearMwebTimeout();
    setOpen(false);
    clearAddress();
  };

  const close = () => {
    open && drawerClose();
  };

  useEffect(() => {
    window.addEventListener('popstate', close);
    return () => {
      window.removeEventListener('popstate', close);
      clearMwebTimeout();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return {
    open,
    openAddress,
    drawerOpen,
    drawerClose,
  };
};
