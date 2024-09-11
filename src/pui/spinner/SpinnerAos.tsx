import React from 'react';
import styled, { keyframes } from 'styled-components';

const spinnerContainer = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const spinnerCircle = keyframes`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`;

const SpinnerAosComponent: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <span role="progressbar" className={className}>
      <svg viewBox="22 22 44 44" xmlns="http://www.w3.org/2000/svg" className="spinner-and">
        <circle cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6" className="spinner-and-circle" />
      </svg>
    </span>
  );
};

/**
 * Figma의 안드로이드 spinner 마스터 컴포넌트
 */
export const SpinnerAos = styled(SpinnerAosComponent)`
  /** svg element에서 사용되는 단위가 px임으로 px단위를 사용 */
  display: inline-block;
  width: inherit;
  height: inherit;
  color: inherit;
  line-height: 0;
  animation: ${spinnerContainer} 1.4s linear infinite;

  .spinner-and-circle {
    animation: ${spinnerCircle} 1.4s ease-in-out infinite;
    stroke: currentColor;
    stroke-dasharray: 106px, 266px;
    stroke-dashoffset: 0px;
  }
`;
