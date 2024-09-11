import { forwardRef, useRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import type { BlankProps, BlankComponentRefModel } from '../../../models';

const BlankComponent = forwardRef<BlankComponentRefModel, BlankProps>(({ className, visible }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    ref: containerRef.current as HTMLDivElement,
  }));

  return (
    <div ref={containerRef} className={className}>
      {visible && <div className="blank" />}
    </div>
  );
});

/**
 * 여백 컴포넌트
 */
export const Blank = styled(BlankComponent)`
  .blank {
    height: ${({ height }) => `${Math.floor(height) / 10}rem`};
    background: ${({ colors = [] }) => {
      if (colors.length === 1) {
        return `${colors[0]}`;
      }
      if (colors.length > 1) {
        return `linear-gradient(${colors.join(',')})`;
      }
      return '';
    }};
  }
`;
