import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CheckoutShippingListItem } from './CheckoutShippingListItem';

export default {
  title: 'Features/Order/CheckoutShippingListItem',
  component: CheckoutShippingListItem,
} as ComponentMeta<typeof CheckoutShippingListItem>;

const Template: ComponentStory<typeof CheckoutShippingListItem> = (args) => {
  const item = {
    id: 1,
    isDefault: true,
    addressName: '회사',
    name: '심명섭',
    phone: '010-4111-4428',
    postCode: '06159',
    address: '서울특별시 강남구 삼성동 143-40',
    addressDetail: '지하 1층 RXC',
  };

  return <CheckoutShippingListItem {...args} item={item} />;
};
export const Basic = Template.bind({});
Basic.args = {
  item: {
    id: 1,
    isDefault: true,
    addressName: '회사',
    name: '심명섭',
    phone: '010-4111-4428',
    postCode: '06159',
    address: '서울특별시 강남구 삼성동 143-40',
    addressDetail: '지하 1층 RXC',
  },
};
