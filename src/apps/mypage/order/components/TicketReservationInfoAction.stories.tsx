import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { TicketReservationInfoAction, TicketReservationInfoActionProps } from './TicketReservationInfoAction';

const addDays = (date: Date, days: number): number => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.getTime();
};

const addHours = (date: Date, Hour: number): number => {
  const result = new Date(date);
  result.setHours(result.getHours() + Hour);
  return result.getTime();
};

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/TicketReservationInfo/action`,
  component: TicketReservationInfoAction,
  args: {
    buttonLabel: '요청',
    disabled: false,
    expiryDate: new Date().getTime(),
  },
} as ComponentMeta<React.FC<TicketReservationInfoActionProps>>;

const Template: ComponentStory<React.FC<TicketReservationInfoActionProps>> = (args) => (
  <TicketReservationInfoAction {...args} />
);

export const 버튼_비활성화 = Template.bind({});
버튼_비활성화.args = {
  disabled: true,
};

export const 바로_확정_주문 = Template.bind({});
바로_확정_주문.args = {
  buttonLabel: '확정',
};

export const 남은_선택기한_7일_초과 = Template.bind({});
남은_선택기한_7일_초과.args = {
  expiryDate: addDays(new Date(), 10),
};

export const 남은_선택기한_7일_이하 = Template.bind({});
남은_선택기한_7일_이하.args = {
  expiryDate: addDays(new Date(), 7),
};

export const 남은_선택기한_1일_이하 = Template.bind({});
남은_선택기한_1일_이하.args = {
  expiryDate: addHours(new Date(), 1),
};
