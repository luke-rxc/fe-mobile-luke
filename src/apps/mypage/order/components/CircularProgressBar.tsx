import { useEffect, useRef } from 'react';
import styled from 'styled-components';

export interface CircularProgressBarProps {
  size: number;
  progress: number;
  trackWidth: number;
  indicatorWidth: number;
  label: number;
}

export const CircularProgressBar = ({
  size,
  progress,
  trackWidth,
  indicatorWidth,
  label,
}: CircularProgressBarProps) => {
  const center = size / 2;
  const radius = center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth);
  const dashArray = 2 * Math.PI * radius;
  const dashOffset = dashArray * ((100 - progress) / 100);
  const progressRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    if (progress) {
      if (progressRef.current?.classList.contains('is-updated-progress')) {
        progressRef.current?.classList.remove('is-updated-progress');
        setTimeout(() => {
          if (progressRef.current) {
            progressRef.current?.classList.add('is-updated-progress');
          }
        }, 400);
      } else {
        progressRef.current?.classList.add('is-updated-progress');
        setTimeout(() => {
          if (progressRef.current) {
            progressRef.current?.classList.remove('is-updated-progress');
          }
        }, 400);
      }
    }
  }, [progress]);
  return (
    <WrapperStyled>
      <div className="progress-wrapper" style={{ width: size, height: size }}>
        <svg className="progress-svg" style={{ width: size, height: size }}>
          <circle className="progress-track" cx={center} cy={center} r={radius} strokeWidth={trackWidth} />
          <circle
            ref={progressRef}
            className="progress-indicator"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={indicatorWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <span className="progress-label">{label}</span>
      </div>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  .progress-wrapper {
    position: relative;
    margin: 0.15rem;
  }

  .progress-svg {
    transform: rotate(-90deg);
  }

  .progress-track {
    fill: transparent;
    stroke: ${({ theme }) => theme.color.backgroundLayout.line};
  }

  .progress-indicator {
    fill: transparent;
    stroke: ${({ theme }) => theme.color.brand.tint};
    transition: stroke-dashoffset 400ms ease-in-out;

    &.is-updated-progress {
      transform-origin: center;
    }
  }

  .progress-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font: ${({ theme }) => theme.fontType.microB};
    color: ${({ theme }) => theme.color.text.textPrimary};
  }
`;
