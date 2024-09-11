import styled from 'styled-components';
import classnames from 'classnames';
import sum from 'lodash/sum';

export interface TicketReservationInfoProgressProps {
  title?: string;
  description?: string;
  waitCount?: number;
  requestCount?: number;
  confirmCount?: number;
  isConfirmed?: boolean;
  className?: string;
}

const TicketReservationInfoProgressComponent: React.FC<TicketReservationInfoProgressProps> = ({
  title,
  description,
  waitCount,
  requestCount,
  confirmCount,
  isConfirmed,
  className,
}) => {
  const classNames = classnames(className, {
    'is-wait': waitCount,
    'is-request': requestCount,
    'is-confirm': confirmCount,
    // 단일 티켓 여부
    'is-only-one': sum([waitCount, requestCount, confirmCount]) === 1,
  });

  return (
    <div className={classNames}>
      {(title || description) && (
        <div className="header">
          {title && <div className="header-title">{title}</div>}
          {description && <div className="header-description">{description}</div>}
        </div>
      )}
      <div className="progress">
        <span className="progress-bar">
          <span className="bar" />
        </span>
        <span className="progress-step">
          <span className="step step-wite">
            대기 <span className="count">{waitCount || ''}</span>
          </span>
          {!isConfirmed && (
            <span className="step step-request">
              요청 <span className="count">{requestCount || ''}</span>
            </span>
          )}
          <span className="step step-confirm">
            확정 <span className="count">{confirmCount || ''}</span>
          </span>
        </span>
      </div>
    </div>
  );
};

export const TicketReservationInfoProgress = styled(TicketReservationInfoProgressComponent)`
  .header {
    padding: ${({ theme }) => `${theme.spacing.s32} ${theme.spacing.s24} ${theme.spacing.s12}`};
    text-align: center;

    &-title {
      color: ${({ theme }) => theme.color.text.textPrimary};
      font: ${({ theme }) => theme.fontType.title2B};
    }

    &-description {
      margin-top: ${({ theme }) => theme.spacing.s4};
      color: ${({ theme }) => theme.color.text.textTertiary};
      font: ${({ theme }) => theme.fontType.mini};
    }
  }

  .progress {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.s12};
    padding: ${({ theme }) => `${theme.spacing.s16} ${theme.spacing.s24}`};

    &-bar {
      display: block;
      overflow: hidden;
      width: 100%;
      height: 0.6rem;
      border-radius: 0.3rem;
      background: ${({ theme }) => theme.color.gray3};

      .bar {
        display: block;
        height: 100%;
        border-radius: inherit;
        background: ${({ theme }) => theme.color.black};
      }
    }

    &-step {
      display: flex;
      justify-content: space-between;
      color: ${({ theme }) => theme.color.text.textPlaceholder};
      font: ${({ theme }) => theme.fontType.mini};

      .step {
        width: 100%;
      }

      .step-request {
        text-align: center;
      }

      .step-confirm {
        text-align: right;
      }
    }
  }

  &.is-wait {
    .bar {
      width: 2.4rem;
    }

    .step-wite {
      color: ${({ theme }) => theme.color.text.textPrimary};
      font-weight: bold;
    }
  }

  &.is-request {
    .bar {
      width: 50%;
    }

    .step-wite {
      color: ${({ theme }) => theme.color.text.textPrimary};
    }

    .step-request {
      color: ${({ theme }) => theme.color.text.textPrimary};
      font-weight: bold;
    }
  }

  &.is-confirm {
    .bar {
      width: 100%;
    }

    .step-wite,
    .step-request {
      color: ${({ theme }) => theme.color.text.textPrimary};
    }

    .step-confirm {
      color: ${({ theme }) => theme.color.text.textPrimary};
      font-weight: bold;
    }
  }

  &.is-only-one {
    .count {
      display: none;
    }
  }
`;
