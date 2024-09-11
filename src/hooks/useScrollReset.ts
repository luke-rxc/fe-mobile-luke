import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 컴포넌트 mount 시 스크롤을 최상단으로 이동시킴
 */
export function useScrollReset() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}
