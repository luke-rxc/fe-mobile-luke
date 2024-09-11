import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { OrderClaimInfo } from './OrderClaimInfo';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/OrderClaimInfo`,
  component: OrderClaimInfo,
} as ComponentMeta<typeof OrderClaimInfo>;

const Template: ComponentStory<typeof OrderClaimInfo> = (args) => <OrderClaimInfo {...args} />;

export const 교환 = Template.bind({});
교환.args = {
  type: 'exchange',
  orderOptions: ['주문옵션1', '주문옵션2', '주문옵션3', '주문옵션4'],
  exchangeOptions: [['교환옵션1', '교환옵션2', '교환옵션3']],
};

export const 취소 = Template.bind({});
취소.args = {
  type: 'cancel',
  reason: '취소사유내용 취소사유내용 취소사유내용 취소사유내용 취소사유내용 취소사유내용',
};

export const 반품 = Template.bind({});
반품.args = {
  type: 'return',
  reason: '반품사유내용 반품사유내용 반품사유내용 반품사유내용 반품사유내용 반품사유내용',
};
