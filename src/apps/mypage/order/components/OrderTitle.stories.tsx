import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { OrderTitle } from './OrderTitle';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/OrderTitle`,
  component: OrderTitle,
} as ComponentMeta<typeof OrderTitle>;

const Template: ComponentStory<typeof OrderTitle> = (args) => <OrderTitle {...args} />;

export const Default = Template.bind({});
Default.args = {
  orderId: 1234567891011123,
  title: '2021. 8. 4',
  href: '',
  isExchangeOrder: true,
  isAllCancellable: true,
};
export const 교환주문 = Template.bind({});
교환주문.args = {
  orderId: 1234567891011123,
  title: '2021. 8. 4',
  href: '',
  isExchangeOrder: true,
};
export const 상세링크 = Template.bind({});
상세링크.args = {
  orderId: 1234567891011123,
  title: '2021. 8. 4',
  href: '상세URL',
};
export const 전체취소 = Template.bind({});
전체취소.args = {
  orderId: 1234567891011123,
  title: '2021. 8. 4',
  isAllCancellable: true,
  orderItemCount: 2,
};
export const 주문취소 = Template.bind({});
주문취소.args = {
  orderId: 1234567891011123,
  title: '2021. 8. 4',
  isAllCancellable: true,
  orderItemCount: 1,
};
