import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { DiscountText } from './DiscountText';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/DiscountText`,
  component: DiscountText,
} as ComponentMeta<typeof DiscountText>;

const Template: ComponentStory<typeof DiscountText> = ({ ...args }) => <DiscountText {...args} />;

export const Default = Template.bind({});
Default.args = {
  pointUsageAmount: 0,
  couponUsageAmount: 0,
};

export const 포인트만_사용 = Template.bind({});
포인트만_사용.args = {
  pointUsageAmount: 1000,
  couponUsageAmount: 0,
};

export const 쿠폰만_사용 = Template.bind({});
쿠폰만_사용.args = {
  pointUsageAmount: 0,
  couponUsageAmount: 1000,
};

export const 포인트_쿠폰만_모두사용 = Template.bind({});
포인트_쿠폰만_모두사용.args = {
  pointUsageAmount: 1000,
  couponUsageAmount: 1000,
};
