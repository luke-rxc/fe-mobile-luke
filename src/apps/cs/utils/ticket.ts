import { TicketStatus, TicketStatusGroup } from '../constants';

export const resolved = (status: TicketStatus) => {
  return [TicketStatus.SOLVED, TicketStatus.CLOSED].some(
    (resolvedStatus) => resolvedStatus.toUpperCase() === status.toUpperCase(),
  );
};

// 티켓 상태 그룹 반환
export function getTicketStatusGroup(status: TicketStatus) {
  switch (status) {
    case TicketStatus.NEW:
    case TicketStatus.OPEN:
      return TicketStatusGroup.WAITING;
    case TicketStatus.PENDING:
    case TicketStatus.HOLD:
    case TicketStatus.SOLVED:
      return TicketStatusGroup.COMPLETE;
    case TicketStatus.CLOSED:
      return TicketStatusGroup.END;
    default:
      return TicketStatusGroup.END;
  }
}
