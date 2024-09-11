import styled from 'styled-components';
import classnames from 'classnames';
import { forwardRef } from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { SpinnerAos } from './SpinnerAos';
import { SpinnerIos } from './SpinnerIos';

export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Spinner 사이즈 */
  size?: 'small' | 'medium' | 'large';
}

const SpinnerComponent = forwardRef<HTMLSpanElement, SpinnerProps>(({ size = 'large', className, ...props }, ref) => {
  const { isIOS } = useDeviceDetect();

  return (
    <span ref={ref} className={classnames(className, `is-${size}`)} {...props}>
      {isIOS ? <SpinnerIos /> : <SpinnerAos />}
    </span>
  );
});

/**
 * Figma의 Spinner 마스터 컴포넌트
 */
export const Spinner = styled(SpinnerComponent)`
  color: ${({ theme }) => theme.color.brand.tint};

  &.is-small {
    ${SpinnerIos}, ${SpinnerAos} {
      width: 2rem;
      height: 2rem;
    }
  }

  &.is-medium {
    ${SpinnerIos} {
      width: 2rem;
      height: 2rem;
    }
    ${SpinnerAos} {
      width: 2.8rem;
      height: 2.8rem;
    }
  }

  &.is-large {
    ${SpinnerIos} {
      width: 3.7rem;
      height: 3.7rem;
    }
    ${SpinnerAos} {
      width: 4rem;
      height: 4rem;
    }
  }
`;
