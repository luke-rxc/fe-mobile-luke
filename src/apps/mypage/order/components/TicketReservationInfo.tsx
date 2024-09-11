import styled from 'styled-components';
import { TicketConfirmType, TicketConfirmTypeText } from '../constants';
import { TicketReservationInfoAction } from './TicketReservationInfoAction';
import { TicketReservationInfoProgress } from './TicketReservationInfoProgress';
import { TicketReservationInfoOptions, TicketReservationInfoOptionsProps } from './TicketReservationInfoOptions';

export interface TicketReservationInfoProps {
  title?: string;
  description?: string;
  expiryDate?: number;
  isConfirmed?: boolean;
  isReservable?: boolean;
  waitCount?: number;
  requestCount?: number;
  confirmCount?: number;
  ticketFields?: TicketReservationInfoOptionsProps['fields'];
  ticketOptions?: TicketReservationInfoOptionsProps['options'];
  className?: string;
  onClickOption?: (exportId: number) => void;
  onClickAction?: () => void;
}

const TicketReservationInfoComponent: React.FC<TicketReservationInfoProps> = (props) => {
  const {
    title,
    description,
    ticketFields,
    ticketOptions,
    expiryDate,
    isConfirmed,
    isReservable,
    waitCount,
    requestCount,
    confirmCount,
    className,
    onClickOption,
    onClickAction,
  } = props;
  return (
    <div className={className}>
      <TicketReservationInfoProgress
        title={title}
        description={description}
        isConfirmed={isConfirmed}
        waitCount={waitCount}
        requestCount={requestCount}
        confirmCount={confirmCount}
      />
      {!!ticketOptions?.length && (
        <>
          <TicketReservationInfoOptions options={ticketOptions} fields={ticketFields} onClickOption={onClickOption} />
          <TicketReservationInfoAction
            disabled={!isReservable}
            expiryDate={expiryDate}
            buttonLabel={TicketConfirmTypeText[isConfirmed ? TicketConfirmType.CONFIRMED : TicketConfirmType.WAIT]}
            onClickACtion={onClickAction}
          />
        </>
      )}
    </div>
  );
};

export const TicketReservationInfo = styled(TicketReservationInfoComponent)``;
