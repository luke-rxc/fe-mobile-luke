import { forwardRef, useEffect, useMemo, useState } from 'react';
import type { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export type CountDownProps = HTMLAttributes<HTMLDivElement> & {
  /** 남은 일수 */
  remainDay: number;
  /** 타임 정보 */
  timer: string;
  /** 텍스트 색상 */
  color: string;
  /** 종료 시간 */
  endDate: number;
};

const VoteTimerComponent = forwardRef<HTMLDivElement, CountDownProps>(
  ({ remainDay, timer, endDate, className }, ref) => {
    const [hourFront, setHourFront] = useState('');
    const [hourBack, setHourBack] = useState('');
    const [minutesFront, setMinutesFront] = useState('');
    const [minutesBack, setMinutesBack] = useState('');
    const [secondsFront, setSecondsFront] = useState('');
    const [secondsBack, setSecondsBack] = useState('');

    const voteTimeText = useMemo(() => {
      const minutes = new Date(endDate).getMinutes();
      const time = `${format(endDate, minutes ? 'M월 d일 a h시 m분' : 'M월 d일 a h시', {
        locale: ko,
      })}`;
      return time;
    }, [endDate]);

    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [h1, h2, d1, m1, m2, d2, s1, s2] = [...timer];
      setHourFront(h1);
      setHourBack(h2);
      setMinutesFront(m1);
      setMinutesBack(m2);
      setSecondsFront(s1);
      setSecondsBack(s2);
    }, [timer]);
    return (
      <div ref={ref} className={className}>
        <div className="time-count">
          {remainDay > 0 && <p>{timer}</p>}
          {remainDay <= 0 && (
            <p className="count">
              <span>{hourFront}</span>
              <span>{hourBack}</span>
              <span className="delimiter">:</span>
              <span>{minutesFront}</span>
              <span>{minutesBack}</span>
              <span className="delimiter">:</span>
              <span>{secondsFront}</span>
              <span>{secondsBack}</span>
            </p>
          )}
        </div>
        <div className="time-text">
          <span className="time-label">투표종료</span>
          <span className="time-date">{voteTimeText}</span>
        </div>
      </div>
    );
  },
);

export const VoteTimer = styled(VoteTimerComponent)`
  padding: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${({ color, theme }) => color || theme.color.text.textPrimary};

  & .time-count {
    font: ${({ theme }) => theme.fontType.headline2B};
    & .delimiter {
      color: ${({ color, theme }) => color || theme.color.text.textPlaceholder};
    }
    & .count {
      & span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
      }
      & .delimiter {
        padding: 0 0.8rem;
        vertical-align: middle;
        color: ${({ color, theme }) => color || theme.color.text.textPlaceholder};
        font: ${({ theme }) => theme.fontType.largeB};
      }
      & span:not(.delimiter) {
        width: 2.4rem;
      }
    }
  }
  & .time-text {
    margin-top: 0.8rem;
  }
  & .time-label {
    margin-right: 0.8rem;
    font: ${({ theme }) => theme.content.contentStyle.fontType.smallB};
    color: ${({ color, theme }) => color || theme.color.text.textPrimary};
  }
  & .time-date {
    font: ${({ theme }) => theme.content.contentStyle.fontType.small};
    color: ${({ color, theme }) => color || theme.color.text.textPrimary};
  }
`;
