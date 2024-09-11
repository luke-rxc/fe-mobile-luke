import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { RefundInfo } from './RefundInfo';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/RefundInfo`,
  component: RefundInfo,
} as ComponentMeta<typeof RefundInfo>;

const Template: ComponentStory<typeof RefundInfo> = (args) => <RefundInfo {...args} />;

export const Default = Template.bind({});
Default.args = {
  goodsAmount: 30000,
  shippingAmount: 3000,
  pointUsageAmount: 3000,
  couponUsageAmount: 3000,
  refundAmount: 33000,
  paymentAmount: 33000,
  methods: ['삼성카드 (일시불)'],
};
