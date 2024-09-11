import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { ShippingInfo } from './ShippingInfo';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/ShippingInfo`,
  component: ShippingInfo,
} as ComponentMeta<typeof ShippingInfo>;

const Template: ComponentStory<typeof ShippingInfo> = (args) => <ShippingInfo {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: '홍길동',
  phoneNumber: '010-1234-1234',
  address: '서울 강남구 도산대로 10길 13 현대하우스 301호',
};

export const 요청사항O = Template.bind({});
요청사항O.args = {
  name: '홍길동',
  phoneNumber: '010-1234-1234',
  address: '서울 강남구 도산대로 10길 13 현대하우스 301호',
  memo: '메모있음',
};

export const 배송지변경가능 = Template.bind({});
배송지변경가능.args = {
  name: '홍길동',
  phoneNumber: '010-1234-1234',
  address: '서울 강남구 도산대로 10길 13 현대하우스 301호',
  memo: '메모있음',
  isChangeShippingAddress: true,
};

export const 받는_사람_정보 = Template.bind({});
받는_사람_정보.args = {
  name: '홍길동',
  phoneNumber: '010-1234-1234',
  isAddressRequired: false,
};
