import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { TicketReservationInfo, TicketReservationInfoProps } from './TicketReservationInfo';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/TicketReservationInfo`,
  component: TicketReservationInfo,
} as ComponentMeta<typeof TicketReservationInfo>;

const Template: ComponentStory<React.FC<TicketReservationInfoProps>> = (args) => <TicketReservationInfo {...args} />;

const addDays = (date: Date, addDay: number): number => {
  const d = new Date(date);
  d.setDate(d.getDate() + addDay);

  return d.getTime();
};

export const Default = Template.bind({});
Default.args = {
  title: '체크인 날짜를 선택해주세요',
  description: '객실 재고 확인 후 예약이 확정됩니다',
  expiryDate: new Date().getTime(),
  isConfirmed: false,
  waitCount: 1,
  requestCount: 0,
  confirmCount: 0,
  ticketOptions: [
    { exportId: 123123, optionValues: ['일-금', '2024년'] },
    { exportId: 1231232, optionValues: ['일-금', '2024년'] },
  ],
  onClickOption: () => {},
  onClickAction: () => {},
};

export const 날짜_선택 = Template.bind({});
날짜_선택.args = {
  title: '체크인 날짜를 선택해주세요',
  description: '객실 재고 확인 후 예약이 확정됩니다',
  expiryDate: addDays(new Date(), 30),
  isConfirmed: false,
  waitCount: 1,
  requestCount: 0,
  confirmCount: 0,
  ticketOptions: [
    { exportId: 33929, optionValues: ['일-금', '2024년'] },
    { exportId: 1231232, optionValues: ['일-금', '2024년'] },
  ],
  ticketFields: {
    33929: {
      label: '6월 3일(월) - 6월 5일(수), 2박 3일',
      value: { exportId: 33929, stayNights: 2, bookingDate: 1717340400000 },
    },
  },
  onClickOption: () => {},
  onClickAction: () => {},
};

export const 에러 = Template.bind({});
에러.args = {
  title: '체크인 날짜를 선택해주세요',
  description: '객실 재고 확인 후 예약이 확정됩니다',
  expiryDate: addDays(new Date(), 30),
  isConfirmed: false,
  waitCount: 1,
  requestCount: 0,
  confirmCount: 0,
  ticketOptions: [
    { exportId: 33929, optionValues: ['일-금', '2024년'] },
    { exportId: 33930, optionValues: ['일-금', '2024년'] },
  ],
  ticketFields: {
    33929: {
      label: '6월 3일(월) - 6월 5일(수), 2박 3일',
      error: '해당 날짜의 객실이 매진되었으니 다른 날짜를 선택해주세요',
      value: { exportId: 33929, stayNights: 2, bookingDate: 1717340400000 },
    },
    33930: {
      label: '6월 3일(월) - 6월 5일(수), 2박 3일',
      value: { exportId: 33930, stayNights: 2, bookingDate: 1717340400000 },
    },
  },
  onClickOption: () => {},
  onClickAction: () => {},
};

export const 모두_요청_상태 = Template.bind({});
모두_요청_상태.args = {
  title: '예약을 요청했습니다',
  description: '3일 내에 예약이 확정됩니다',
  isConfirmed: false,
  waitCount: 0,
  requestCount: 2,
  confirmCount: 0,
};

export const 일부_확정_완료 = Template.bind({});
일부_확정_완료.args = {
  title: '예약을 요청했습니다',
  description: '3일 내에 예약이 확정됩니다',
  isConfirmed: false,
  waitCount: 0,
  requestCount: 1,
  confirmCount: 1,
};
