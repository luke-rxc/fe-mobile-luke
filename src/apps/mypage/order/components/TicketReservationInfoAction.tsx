import styled from 'styled-components';
import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { useMemo } from 'react';
import { isWithin24Hours } from '@utils/date';
import { toHHMMSS } from '@utils/toTimeformat';
import { useDDay } from '@services/useDDay';
import { Button } from '@pui/button';

export interface TicketReservationInfoActionProps {
  buttonLabel: string;
  className?: string;
  expiryDate?: number;
  disabled?: boolean;
  onClickACtion?: () => void;
}

const TicketReservationInfoActionComponent: React.FC<TicketReservationInfoActionProps> = ({
  disabled,
  className,
  expiryDate,
  buttonLabel,
  onClickACtion,
}) => {
  const { displayExpiryDate } = useDisplayExpiryDate(expiryDate || 0);

  return (
    <div className={className}>
      <span className="action-expiry">
        <span className="text">선택 기한</span>
        <span className="date">{displayExpiryDate}</span>
      </span>
      <span className="action-button">
        <Button
          block
          bold
          size="large"
          variant="primary"
          disabled={disabled}
          children={buttonLabel}
          onClick={onClickACtion}
        />
      </span>
    </div>
  );
};

export const TicketReservationInfoAction = styled(TicketReservationInfoActionComponent)`
  padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24} ${theme.spacing.s24}`};

  .action-expiry {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.s4};
    height: 3.6rem;
    font: ${({ theme }) => theme.fontType.miniB};

    .text {
      color: ${({ theme }) => theme.color.text.textPrimary};
    }

    .date {
      color: ${({ theme }) => theme.color.semantic.noti};
    }
  }
`;

const useDisplayExpiryDate = (expiryDate: number) => {
  const { isCountDown, expiryDateString } = useMemo(() => {
    const diffDays = differenceInCalendarDays(expiryDate, Date.now());

    if (isWithin24Hours(expiryDate)) {
      return { isCountDown: true, expiryDateString: '' };
    }

    if (diffDays <= 7) {
      return { isCountDown: false, expiryDateString: `D-${diffDays}` };
    }

    return { isCountDown: false, expiryDateString: format(expiryDate, '~ yyyy. M. d') };
  }, [expiryDate]);

  const { countDown } = useDDay(isCountDown ? { time: expiryDate ?? 0 } : { time: -1, enabled: false });

  return {
    displayExpiryDate: isCountDown ? toHHMMSS(countDown) : expiryDateString,
  };
};
