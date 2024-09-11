import styled, { keyframes } from 'styled-components';

const spinnerStick = keyframes`
  from {
    opacity: 0.5;
  }

  to {
    opacity: 0;
  }
`;

const SpinnerIosComponent: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <span className={className}>
      <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="spinner-ios">
        <rect x="2.979" y="5.80762" width="4" height="10" rx="2" transform="rotate(-45 2.979 5.80762)" />
        <rect x="10" y="13" width="4" height="10" rx="2" transform="rotate(90 10 13)" />
        <rect x="10.0503" y="17.1211" width="4" height="10" rx="2" transform="rotate(45 10.0503 17.1211)" />
        <rect x="13" y="20" width="4" height="10" rx="2" />
        <rect x="17.1211" y="19.9497" width="4" height="10" rx="2" transform="rotate(-45 17.1211 19.9497)" />
        <rect x="30" y="13" width="4" height="10" rx="2" transform="rotate(90 30 13)" />
        <rect x="24.1924" y="2.979" width="4" height="10" rx="2" transform="rotate(45 24.1924 2.979)" />
        <rect x="13" width="4" height="10" rx="2" />
      </svg>
    </span>
  );
};

/**
 * Figma의 IOS spinner 마스터 컴포넌트
 */
export const SpinnerIos = styled(SpinnerIosComponent)`
  /** svg element에서 사용되는 단위가 px임으로 px단위를 사용 */

  display: inline-block;
  width: inherit;
  height: inherit;
  color: inherit;

  .spinner-ios * {
    animation: ${spinnerStick} 0.8s linear infinite;
    fill: currentColor;

    &:nth-child(1) {
      animation-delay: -0.1s;
    }

    &:nth-child(2) {
      animation-delay: -0.2s;
    }

    &:nth-child(3) {
      animation-delay: -0.3s;
    }

    &:nth-child(4) {
      animation-delay: -0.4s;
    }

    &:nth-child(5) {
      animation-delay: -0.5s;
    }

    &:nth-child(6) {
      animation-delay: -0.6s;
    }

    &:nth-child(7) {
      animation-delay: -0.7s;
    }
  }
`;
