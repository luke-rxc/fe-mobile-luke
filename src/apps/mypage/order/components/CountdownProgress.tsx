import { InfoFilled } from '@pui/icon';
import { useTheme } from '@hooks/useTheme';
import { CircleCheck, LottieRef } from '@pui/lottie';
import { useRef } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { CircularProgressBar } from './CircularProgressBar';

export interface CountdownProgressProps {
  count: number;
  total: number;
  textColor?: string;
}

export const CountdownProgress = ({ count, total }: CountdownProgressProps) => {
  const { theme } = useTheme();
  const lottie = useRef<LottieRef>(null);
  const iconDefaultProps = { size: '2.4rem', colorCode: theme.color.semantic.error };
  const requiredCount = total - count;
  const progress = 100 - ((total - count) / total) * 100;
  if (requiredCount > 0) {
    return (
      <WrapperStyled
        className={classNames({
          'is-info': requiredCount === total,
          'is-progress': total > 1 && requiredCount < total,
        })}
      >
        {/* 초기 입력 전 느낌표 표현 */}
        <InfoFilled {...iconDefaultProps} />

        {/* 옵션 구매 수량(total)이 2개 이상 && 입력 해야하는 수(requirdCount)가 total 보다 작은 경우 progress 표현 */}
        <CircularProgressBar size={21} progress={progress} label={requiredCount} trackWidth={1} indicatorWidth={1.5} />
      </WrapperStyled>
    );
  }
  // 완료 (requiredCount=0) lottie 표현
  return (
    <CircleCheck
      ref={lottie}
      animationOptions={{
        loop: false,
      }}
      width="2.4rem"
      height="2.4rem"
      lottieColor={theme.color.brand.tint}
      className="lottie-motion"
    />
  );
};

const WrapperStyled = styled.div`
  & > * {
    visibility: hidden;
    ${({ theme }) => theme.absolute({ t: '50%', r: 0 })};
    transform: translateY(-50%);
  }

  &.is-info {
    ${InfoFilled} {
      visibility: visible;
    }
  }

  &.is-progress {
    ${InfoFilled} ~ * {
      visibility: visible;
    }
  }
`;
