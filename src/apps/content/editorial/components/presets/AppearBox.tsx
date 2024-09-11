import { useRef, useState } from 'react';
import type { FC } from 'react';
import styled, { css } from 'styled-components';
import { AppearType } from '../../constants';
import { useScrollTrigger } from '../../hooks';
import type { AppearBoxProps, AppearStyledProps } from '../../models';

/**
 * element 등장모션 처리 컴포넌트
 */
export const AppearBox: FC<AppearBoxProps> = (props) => {
  const elRef = useRef(null);
  const [isActiveAnim, setIsActiveAnim] = useState(false);

  const {
    children,
    className = '',
    appear = AppearType.FROM_BOTTOM,
    viewRatio = 0.95,
    isToggle = false,
    delay = 0,
  } = props;

  // 화면에 노출 되는 시점에 활성화 애니메이션 추가
  useScrollTrigger(elRef, (trigger: boolean) => setIsActiveAnim(trigger), {
    viewRatio,
    isToggle,
  });

  const appearStyledProps: AppearStyledProps = {
    appear,
    delay,
  };

  return (
    <AppearStyled ref={elRef} className={`${className} ${isActiveAnim && appear.toLowerCase()}`} {...appearStyledProps}>
      {children}
    </AppearStyled>
  );
};
const AppearStyled = styled.div<AppearStyledProps>`
  position: relative;
  opacity: ${({ appear }) => (appear === AppearType.NONE ? 1 : 0)};
  transition: all 0.6s cubic-bezier(0.42, 0, 0.58, 1);
  transition-delay: ${({ delay }) => `${delay}s`};
  ${({ appear }) => {
    if (appear === AppearType.FROM_BOTTOM) {
      return css`
        transform: translate3d(0, 5rem, 0);
      `;
    }
    if (appear === AppearType.FROM_TOP) {
      return css`
        transform: translate3d(0, -5rem, 0);
      `;
    }
    if (appear === AppearType.FROM_LEFT) {
      return css`
        transform: translateX(-5rem);
      `;
    }
    if (appear === AppearType.FROM_RIGHT) {
      return css`
        transform: translateX(5rem);
      `;
    }
    return null;
  }}

  &.from_bottom {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  &.from_top {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  &.from_left {
    transform: translateX(0);
    opacity: 1;
  }
  &.from_right {
    transform: translateX(0);
    opacity: 1;
  }
  &.none {
    opacity: 1;
  }
`;
