import { ComponentStory, ComponentMeta } from '@storybook/react';
import { orderComplete } from '../../apis/__mocks__';
import { toOrderModel } from '../../models';
import { OrderSchema } from '../../schemas';
import { OrderContent } from './OrderContent';

export default {
  title: 'Features/Order/OrderContent',
  component: OrderContent,
} as ComponentMeta<typeof OrderContent>;

const Template: ComponentStory<typeof OrderContent> = (args) => {
  const item = toOrderModel(orderComplete as OrderSchema);
  return <OrderContent {...args} item={item} />;
};
export const Basic = Template.bind({});
Basic.args = {};
