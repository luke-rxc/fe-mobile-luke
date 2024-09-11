import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { CouponCard } from './CouponCard';

export default {
  title: `${StoriesMenu.PDS.DataDisplayCardType}/CouponCard`,
  component: CouponCard,
} as ComponentMeta<typeof CouponCard>;

const Template: ComponentStory<typeof CouponCard> = (args) => {
  return <CouponCard {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  name: '쿠폰명쿠폰명쿠폰명쿠폰명쿠폰명일이삼사오육칠팔구십',
  discount: '5,000원',
  status: 'default',
  bgColor: '#AE9D94',
};
export const 완료 = Template.bind({});
완료.args = {
  name: '쿠폰명쿠폰명쿠폰명쿠폰명쿠폰명일이삼사오육칠팔구십',
  discount: '5,000원',
  status: 'complete',
};
export const 쿠폰소진 = Template.bind({});
쿠폰소진.args = {
  name: '쿠폰명쿠폰명쿠폰명쿠폰명쿠폰명일이삼사오육칠팔구십',
  discount: '5,000원',
  status: 'runout',
};
