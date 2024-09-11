import { ComponentStory, ComponentMeta } from '@storybook/react';
import { orderComplete } from '../../apis/__mocks__';
import { toOrderModel } from '../../models';
import { OrderSchema } from '../../schemas';
import { OrderRecipientInfo } from './OrderRecipientInfo';

export default {
  title: 'Features/Order/OrderRecipientInfo',
  component: OrderRecipientInfo,
} as ComponentMeta<typeof OrderRecipientInfo>;

const Template: ComponentStory<typeof OrderRecipientInfo> = (args) => {
  const item = toOrderModel(orderComplete as OrderSchema).recipient;

  if (!item) {
    return <></>;
  }

  return <OrderRecipientInfo {...args} item={item} />;
};
export const Basic = Template.bind({});
Basic.args = {};
