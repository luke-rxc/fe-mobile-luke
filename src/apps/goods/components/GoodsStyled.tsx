import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { GoodsSalesSchedulerType } from '../constants';

interface ContentSubWrapperProps {
  salesSchedulerType?: GoodsSalesSchedulerType;
  isInfinity: boolean;
  children?: React.ReactNode;
}

export const ContentsSubWrapper = ({ salesSchedulerType, isInfinity, children }: ContentSubWrapperProps) => {
  const { isIOSWebChrome } = useDeviceDetect();
  const subWrapperRef = useRef<HTMLDivElement>(null);

  /** 프리오더 or 판매예정 상품일 경우 */
  const infinityStock =
    (salesSchedulerType === GoodsSalesSchedulerType.PREORER && isInfinity) ||
    salesSchedulerType === GoodsSalesSchedulerType.NORMAL;

  /**
   * Preorder 활성화 Motion 처리
   */
  useEffect(() => {
    if (salesSchedulerType) {
      if (subWrapperRef.current) {
        subWrapperRef.current.classList.remove('sales-info-view');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subWrapperRef.current]);

  return (
    <ContentsSubWrapperStyled
      ref={subWrapperRef}
      className={classnames({
        'sales-info-view': !!salesSchedulerType,
        'infinity-stock': infinityStock,
        'ios-web-chrome': isIOSWebChrome,
      })}
    >
      {children}
    </ContentsSubWrapperStyled>
  );
};

const ContentsSubWrapperStyled = styled.div`
  position: relative;
  transform: translateY(0);
  transition: transform 300ms ease-in 400ms;

  &.ios-web-chrome {
    transition: transform 700ms ease 400ms;
  }

  &.sales-info-view {
    transform: translateY(-12.1rem);
    &.infinity-stock {
      transform: translateY(-7.2rem);
    }
  }
`;
