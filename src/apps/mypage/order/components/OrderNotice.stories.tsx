import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { OrderNotice } from './OrderNotice';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/OrderNotice`,
  component: OrderNotice,
} as ComponentMeta<typeof OrderNotice>;

const Template: ComponentStory<typeof OrderNotice> = ({ ...args }) => <OrderNotice {...args} />;

export const 기본 = Template.bind({});

기본.args = {
  noticeMessage: '안내 메시지',
};
