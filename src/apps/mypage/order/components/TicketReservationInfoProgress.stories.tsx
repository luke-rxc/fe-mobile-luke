import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { TicketReservationInfoProgress, TicketReservationInfoProgressProps } from './TicketReservationInfoProgress';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/TicketReservationInfo/progress`,
  component: TicketReservationInfoProgress,
  args: {
    title: '체크인 날짜를 선택해주세요',
    description: '객실 재고 확인 후 예약이 확정됩니다',
    waitCount: 1,
    requestCount: 0,
    confirmCount: 0,
    isConfirmed: false,
  },
} as ComponentMeta<React.FC<TicketReservationInfoProgressProps>>;

const Template: ComponentStory<React.FC<TicketReservationInfoProgressProps>> = (args) => (
  <TicketReservationInfoProgress {...args} />
);

export const 단건_주문 = Template.bind({});
단건_주문.args = {
  waitCount: 1,
  requestCount: 0,
  confirmCount: 0,
};

export const 다건_주문_예약대기 = Template.bind({});
다건_주문_예약대기.args = {
  waitCount: 2,
  requestCount: 0,
  confirmCount: 0,
};

export const 다건_주문_예약요청 = Template.bind({});
다건_주문_예약요청.args = {
  waitCount: 0,
  requestCount: 2,
  confirmCount: 0,
};

export const 다건_주문_예약_확정 = Template.bind({});
다건_주문_예약_확정.args = {
  waitCount: 0,
  requestCount: 1,
  confirmCount: 1,
};

export const 바로_확정_주문 = Template.bind({});
바로_확정_주문.args = {
  description: '바로 예약이 확정됩니다',
  isConfirmed: true,
};
