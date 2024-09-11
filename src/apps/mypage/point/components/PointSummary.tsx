import React from 'react';
import styled from 'styled-components';
import { Divider } from '@pui/divider';

export interface PointSummaryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'css'> {
  /** 가용 포인트 */
  savedPoint: string;
  /** 오늘 만료 예정 포인트 */
  expiresTodayPoint?: string;
  /** 한달 이내 만료 예정 포인트 */
  expiresMonthPoint?: string;
}

/**
 * 적립금 summary 컨테이너
 */
export const PointSummary = styled(
  ({ savedPoint, expiresMonthPoint, expiresTodayPoint, className, ...props }: PointSummaryProps) => {
    return (
      <div className={className} {...props}>
        <div className="point-current">
          {savedPoint}
          <span className="unit">원</span>
        </div>

        {(expiresTodayPoint || expiresMonthPoint) && <Divider />}

        {expiresTodayPoint && (
          <div className="point-expires is-today">
            <div className="title">오늘 소멸 예정</div>
            <div className="point">{expiresTodayPoint}원</div>
          </div>
        )}

        {expiresMonthPoint && (
          <div className="point-expires">
            <div className="title">한 달 내 소멸 예정</div>
            <div className="point">{expiresMonthPoint}원</div>
          </div>
        )}
      </div>
    );
  },
)`
  padding: 1.6rem 2.4rem 2.4rem;
  background: ${({ theme }) => theme.color.surface};

  .point-current {
    color: ${({ theme }) => theme.color.black};
    font-size: ${({ theme }) => theme.fontSize.s32};
    font-weight: bold;
    line-height: 3.8rem;

    .unit {
      font-size: ${({ theme }) => theme.fontSize.s20};
    }
  }

  ${Divider} {
    padding: 2.4rem 0 1.2rem;
  }

  .point-expires {
    display: flex;
    align-items: center;
    min-height: 3.2rem;
    padding: 0.8rem 0;
    box-sizing: border-box;

    .title {
      flex: 0 0 auto;
    }
    .point {
      flex: 1 1 auto;
      font-weight: bold;
      text-align: right;
    }
  }

  .point-expires.is-today {
    .title {
      font-weight: bold;
    }
    .point {
      color: ${({ theme }) => theme.color.red};
    }
  }
`;
