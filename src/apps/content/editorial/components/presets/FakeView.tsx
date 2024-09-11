import { forwardRef } from 'react';
import styled from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FakeViewComponent = forwardRef<HTMLDivElement, any>(({ className }, ref) => {
  return (
    <div ref={ref} className={className}>
      <div className="fake-view">
        <div className="inner">
          <div className="viewport" />
          <div className="view-bottom" />
        </div>
      </div>
    </div>
  );
});

export const FakeView = styled(FakeViewComponent)`
  .fake-view {
    overflow: hidden;
    height: 0;
    .inner {
      position: fixed;
      & .viewport {
        height: 100vh;
      }
      & .view-bottom {
        height: calc(env(safe-area-inset-bottom));
      }
    }
  }
`;
