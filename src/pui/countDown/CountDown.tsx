/**
 * 카운트 다운 컴포넌트
 * @require useDDay hook 을 기반으로 진행
 */

import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { toHHMMSS } from '@utils/toTimeformat';

type CountDownSizeType = 20 | 24 | 40;

export interface CountDownProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 정렬, @default left */
  direction?: 'left' | 'right' | 'center';
  /** 1일 이상 남았을 시의 사이즈, @default 20 */
  daySize?: CountDownSizeType;
  /** 1일 미만, 10분 이상 남았을 시의 사이즈, @default 20 */
  timeSize?: CountDownSizeType;
  /** 1일 미만, 10분 미만 남았을 시의 사이즈, @default 20 */
  nearTimeSize?: CountDownSizeType;
  /** 텍스트 컬러, @default Theme black */
  textColor?: string;
  /** useDDay hook Props */
  remainDay: number;
  /** useDDay hook Props */
  countDown: number;
  /** useDDay hook Props */
  countDownEnd: boolean;
  /** 종료되었을때 hide 여부, @default false */
  hideAfterCountDownEnd?: boolean;
}

// 모드
const CountDownMode = {
  // 1일 이상 남았을 시
  DAY: 'DAY',
  // 1일 미만, 10분 이상
  TIME: 'TIME',
  // 1일 미만, 10분 미만
  NEAR_TIME: 'NEAR_TIME',
  // Finish
  FINISH: 'FINISH',
} as const;

const getCountDownMode = (remainDay: number, countDown: number, countDownEnd: boolean) => {
  if (remainDay > 0) {
    return CountDownMode.DAY;
  }
  if (countDownEnd) {
    return CountDownMode.FINISH;
  }
  const remainMinute = countDown / 1000 / 60;
  return remainMinute > 10 ? CountDownMode.TIME : CountDownMode.NEAR_TIME;
};

const CountDownComponent = forwardRef<HTMLDivElement, CountDownProps>(
  (
    {
      daySize = 20,
      timeSize = 20,
      nearTimeSize = 20,
      remainDay,
      countDown,
      countDownEnd,
      hideAfterCountDownEnd = false,
      className,
    },
    ref,
  ) => {
    const mode = getCountDownMode(remainDay, countDown, countDownEnd);
    return (
      <div ref={ref} className={className}>
        {mode === CountDownMode.DAY && <p className={`s${daySize}`}>D-{remainDay}</p>}
        {mode === CountDownMode.TIME && <p className={`s${timeSize}`}>{toHHMMSS(countDown)}</p>}
        {mode === CountDownMode.NEAR_TIME && <p className={`s${nearTimeSize}`}>{toHHMMSS(countDown)}</p>}
        {mode === CountDownMode.FINISH && !hideAfterCountDownEnd && <p className={`s${nearTimeSize}`}>00:00:00</p>}
      </div>
    );
  },
);

/**
 * Figma 시간 카운트 다운
 */
export const CountDown = styled(CountDownComponent)`
  color: ${({ theme, textColor }) => textColor ?? theme.color.text.textPrimary};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-align: ${({ direction = 'left' }) => direction};

  & .s20 {
    font: ${({ theme }) => theme.fontType.title2B};
  }

  & .s24 {
    font: ${({ theme }) => theme.fontType.titleB};
  }

  & .s40 {
    /** TODO: PDS 폰트 확인 필요 */
    font-size: 4rem;
    line-height: 4.8rem;
  }
`;
