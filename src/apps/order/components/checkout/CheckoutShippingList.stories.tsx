import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CheckoutShippingList } from './CheckoutShippingList';

export default {
  title: 'Features/Order/CheckoutShippingList',
  component: CheckoutShippingList,
} as ComponentMeta<typeof CheckoutShippingList>;

const Template: ComponentStory<typeof CheckoutShippingList> = (args) => {
  return <CheckoutShippingList {...args} />;
};
export const Basic = Template.bind({});
Basic.args = {
  items: [
    {
      id: 1,
      isDefault: true,
      addressName: '회사',
      name: 'rxc',
      phone: '010-1234-1234',
      postCode: '06159',
      address: '서울특별시 강남구 삼성동 143-40',
      addressDetail: '지하 1층 RXC',
    },
  ],
};
