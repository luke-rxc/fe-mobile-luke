import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useGoodsPageInfo } from './useGoodsPageInfo';

export const useGoodsFloating = () => {
  const { isApp, isAndroid } = useDeviceDetect();
  const { isInLivePage } = useGoodsPageInfo();

  const [isFloating, setIsFloating] = useState<boolean>(false);
  const [getPositionY, setGetPositionY] = useState<number>(0);

  const targetRef = useRef<HTMLDivElement>(null);

  const handleFloating = () => {
    /** 라이브 페이지에서 상품상세 접근시 안드로이드만 웹 위에 앱 헤더가 덮는 방식이 아니라 별도로 위치해 있어 위치값이 다름 */
    const positionY = isApp && isAndroid && isInLivePage ? getPositionY + 56 : getPositionY;
    // 해당 element가 화면 최상단에 위치할 경우
    if (window.scrollY > positionY) {
      setIsFloating(true);
      return;
    }
    setIsFloating(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(
    debounce(() => {
      if (getPositionY) {
        handleFloating();
      }
    }, 0),
    [getPositionY],
  );

  const handleGetPositionY = () => {
    // target element 절대좌표
    targetRef.current && setGetPositionY(window.scrollY + targetRef.current.getBoundingClientRect().y);
  };

  useLayoutEffect(() => {
    handleGetPositionY();

    /** 프리오더 or 판매예정 시 sales-info-view가 늘어나는 영역에 의해 버튼 위치값이 달라지는 현상으로 트랜지션 후 위치값 재확인 */
    window.setTimeout(() => {
      handleGetPositionY();
    }, 1100);
  }, []);

  useEffect(() => {
    handleFloating();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleGetPositionY);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleGetPositionY);
      setIsFloating(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPositionY]);

  return { targetRef, isFloating };
};
