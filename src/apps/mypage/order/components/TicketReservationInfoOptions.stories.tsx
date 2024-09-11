import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { TicketReservationInfoOptions, TicketReservationInfoOptionsProps } from './TicketReservationInfoOptions';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/TicketReservationInfo/options`,
  component: TicketReservationInfoOptions,
  args: {
    options: [{ exportId: 123123, optionValues: ['{옵션값1}', '{옵션값2}', '{옵션값3}'] }],
  },
} as ComponentMeta<React.FC<TicketReservationInfoOptionsProps>>;

const Template: ComponentStory<React.FC<TicketReservationInfoOptionsProps>> = (args) => (
  <TicketReservationInfoOptions {...args} />
);

export const 날짜_미선택 = Template.bind({});
날짜_미선택.args = {};

export const 날짜_선택시 = Template.bind({});
날짜_선택시.args = {
  options: [
    {
      exportId: 123123,
      optionValues: ['{옵션값1}', '{옵션값2}', '{옵션값3}'],
    },
  ],
  fields: {
    123123: {
      label: '7월 29일(목) - 7월 30일(금), 1박 2일',
      value: { exportId: 123123, bookingDate: Date.now(), stayNights: 1 },
      error: false,
    },
  },
};

export const 긴_옵션명 = Template.bind({});
긴_옵션명.args = {
  options: [
    {
      exportId: 123123,
      optionValues: ['2박 연박 (토스카나 + 시에나)', '프리즘 특가 기간 (5.3-5.5 / 6.6-6.8 / 7.18-7.31)', '스탠다드킹'],
    },
  ],
  fields: {
    123123: {
      label: '7월 29일(목) - 7월 30일(금), 1박 2일',
      value: { exportId: 123123, bookingDate: Date.now(), stayNights: 1 },
      error: false,
    },
  },
};

export const 멀티_옵션 = Template.bind({});
멀티_옵션.args = {
  options: [
    {
      exportId: 123123,
      optionValues: ['{옵션값1}', '{옵션값2}', '{옵션값3}'],
    },
    {
      exportId: 1231233,
      optionValues: ['2박 연박 (토스카나 + 시에나)', '프리즘 특가 기간 (5.3-5.5 / 6.6-6.8 / 7.18-7.31)', '스탠다드킹'],
    },
  ],
};

export const error = Template.bind({});
error.args = {
  options: [
    {
      exportId: 123123,
      optionValues: ['{옵션값1}', '{옵션값2}', '{옵션값3}'],
    },
  ],

  fields: {
    123123: {
      value: { exportId: 123123, bookingDate: Date.now(), stayNights: 1 },
      label: '7월 29일(목) - 7월 30일(금), 1박 2일',
      error: '해당 날짜의 객실이 매진되었으니 다른 날짜를 선택해주세요',
    },
  },
};
