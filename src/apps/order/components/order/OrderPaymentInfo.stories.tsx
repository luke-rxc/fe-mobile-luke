import { ComponentStory, ComponentMeta } from '@storybook/react';
import { orderComplete } from '../../apis/__mocks__';
import { toOrderModel } from '../../models';
import { OrderSchema } from '../../schemas';
import { OrderPaymentInfo } from './OrderPaymentInfo';

export default {
  title: 'Features/Order/OrderPaymentInfo',
  component: OrderPaymentInfo,
} as ComponentMeta<typeof OrderPaymentInfo>;

const Template: ComponentStory<typeof OrderPaymentInfo> = (args) => {
  const item = toOrderModel(orderComplete as OrderSchema).payment;

  if (!item) {
    return <></>;
  }

  return <OrderPaymentInfo {...args} item={item} />;
};
export const Basic = Template.bind({});
Basic.args = {};
