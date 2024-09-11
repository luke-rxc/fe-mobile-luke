import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { EstimatedRefundInfo } from './EstimatedRefundInfo';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/EstimatedRefundInfo`,
  component: EstimatedRefundInfo,
} as ComponentMeta<typeof EstimatedRefundInfo>;

const Template: ComponentStory<typeof EstimatedRefundInfo> = (args) => <EstimatedRefundInfo {...args} />;

export const Default = Template.bind({});
Default.args = {
  goodsAmount: 30000,
  shippingAmount: 3000,
  pointUsageAmount: 3000,
  couponUsageAmount: 3000,
  refundableAmount: 33000,
  method: '삼성카드 (일시불)',
};

export const 배송비_미노출 = Template.bind({});
배송비_미노출.args = {
  goodsAmount: 30000,
  shippingAmount: 3000,
  pointUsageAmount: 3000,
  couponUsageAmount: 3000,
  refundableAmount: 33000,
  showShippingAmount: false,
  method: '삼성카드 (일시불)',
};
