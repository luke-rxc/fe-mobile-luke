import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { PaymentInfo } from './PaymentInfo';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/PaymentInfo`,
  component: PaymentInfo,
} as ComponentMeta<typeof PaymentInfo>;

const Template: ComponentStory<typeof PaymentInfo> = (args) => <PaymentInfo {...args} />;

export const Default = Template.bind({});
Default.args = {
  goodsAmount: 30000,
  shippingAmount: 3000,
  pointUsageAmount: 4000,
  couponUsageAmount: 4000,
  method: '삼성카드 (일시불)',
  paymentAmount: 33000,
};
