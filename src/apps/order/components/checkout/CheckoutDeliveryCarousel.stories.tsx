import { getDelivery } from '@features/delivery/apis/__mocks__';
import { toDeliveryListModel } from '@features/delivery/models';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CheckoutDeliveryCarousel } from './CheckoutDeliveryCarousel';

export default {
  title: 'Features/Order/CheckoutDeliveryCarousel',
  component: CheckoutDeliveryCarousel,
} as ComponentMeta<typeof CheckoutDeliveryCarousel>;

const Template: ComponentStory<typeof CheckoutDeliveryCarousel> = (args) => {
  const { content: deliveryList } = toDeliveryListModel(getDelivery);
  return <CheckoutDeliveryCarousel {...args} deliveryList={deliveryList} />;
};
export const Basic = Template.bind({});
Basic.args = {};
