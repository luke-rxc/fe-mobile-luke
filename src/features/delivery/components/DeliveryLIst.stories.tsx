import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DeliveryList } from './DeliveryList';

export default {
  title: 'Features/Delivery/DeliveryList',
  component: DeliveryList,
} as ComponentMeta<typeof DeliveryList>;

const Template: ComponentStory<typeof DeliveryList> = (args) => {
  return <DeliveryList {...args} />;
};
export const Basic = Template.bind({});
Basic.args = {
  items: [
    {
      id: 1,
      isDefault: true,
      addressName: '회사1',
      name: '심명섭',
      phone: '010-1234-1234',
      postCode: '06159',
      address: '서울특별시 강남구 삼성동 143-40',
      addressDetail: '지하 1층 RXC',
    },
    {
      id: 2,
      isDefault: false,
      addressName: '회사2',
      name: 'kai',
      phone: '010-1234-1234',
      postCode: '06159',
      address: '서울특별시 강남구 삼성동 143-40',
      addressDetail: '지하 1층 RXC',
    },
  ],
};
