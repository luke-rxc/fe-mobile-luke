import { useState, useEffect } from 'react';
import type { HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { FadeState } from '../constants';

type FadeProps = HTMLAttributes<HTMLDivElement> & {
  /** 페이드 상태 */
  state?: FadeState;
  /** 페이드 animation time */
  animationTime?: number;
};

export const Fade = ({ children, animationTime = 0.3, ...props }: FadeProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { state } = props;
  const onAnimationEnd = () => {
    if (state === FadeState.OUT) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (state === FadeState.IN) {
      setIsVisible(true);
    }
  }, [state]);

  return (
    <FadeStyled
      className={classNames(state, {
        'is-in': state === FadeState.IN,
        'is-out': state === FadeState.OUT,
        'is-hide': !isVisible,
      })}
      animationTime={animationTime}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </FadeStyled>
  );
};

const FadeStyled = styled.div.attrs(({ animationTime }: { animationTime: number }) => {
  return {
    animationTime,
  };
})`
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes fadeOut {
    100% {
      opacity: 0;
    }
  }

  &.is-hide {
    display: none;
  }

  &.is-in {
    ${({ animationTime }) => {
      return css`
        animation: fadeIn ${animationTime}s forwards ease-out;
      `;
    }}
  }
  &.is-out {
    ${({ animationTime }) => {
      return css`
        animation: fadeOut ${animationTime}s forwards ease-out;
      `;
    }}
  }
`;
