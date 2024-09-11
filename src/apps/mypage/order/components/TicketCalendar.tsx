import styled from 'styled-components';
import { DatePicker, DatePickerProps } from '@features/datePicker/components';
import { List } from '@pui/list';
import { ListItemTable, ListItemTableProps } from '@pui/listItemTable';
import { TicketCalendarSchema } from '../schemas';

export interface TicketCalendarProps extends DatePickerProps<TicketCalendarSchema> {
  optionInfos: Pick<ListItemTableProps, 'title' | 'text'>[];
  className?: string;
}

const TicketCalendarComponent: React.FC<TicketCalendarProps> = ({ optionInfos, className, ...rest }) => {
  return (
    <div className={className}>
      <div className="calendar-banner">
        <List source={optionInfos} component={ListItemTable} />
      </div>
      <div className="calendar-picker">
        <DatePicker {...rest} />
      </div>
    </div>
  );
};

export const TicketCalendar = styled(TicketCalendarComponent)`
  .calendar-banner {
    padding: ${({ theme }) => `${theme.spacing.s12} ${theme.spacing.s24}`};

    ${List} {
      padding: ${({ theme }) => `${theme.spacing.s12} 0`};
      border-radius: ${({ theme }) => theme.radius.r8};
      background: ${({ theme }) => theme.color.background.bg};
    }

    ${ListItemTable} {
      min-height: 2.4rem;
      margin-top: ${({ theme }) => theme.spacing.s4};
      padding: ${({ theme }) => `${theme.spacing.s4} ${theme.spacing.s16}`};
      font: ${({ theme }) => theme.fontType.mini};

      &:first-child {
        margin-top: 0;
      }
    }
  }
`;
