import { ComponentStory, ComponentMeta } from '@storybook/react';
import { orderComplete } from '../../apis/__mocks__';
import { toOrderModel } from '../../models';
import { OrderSchema } from '../../schemas';
import { OrdererInfo } from './OrdererInfo';

export default {
  title: 'Features/Order/OrdererInfo',
  component: OrdererInfo,
} as ComponentMeta<typeof OrdererInfo>;

const Template: ComponentStory<typeof OrdererInfo> = (args) => {
  const item = toOrderModel(orderComplete as OrderSchema).orderer;
  return <OrdererInfo {...args} item={item} />;
};
export const Basic = Template.bind({});
Basic.args = {};
