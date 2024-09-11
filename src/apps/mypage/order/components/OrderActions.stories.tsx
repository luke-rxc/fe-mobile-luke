import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { OrderActions } from './OrderActions';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/OrderActions`,
  component: OrderActions,
} as ComponentMeta<typeof OrderActions>;

const Template: ComponentStory<typeof OrderActions> = (args) => {
  return (
    <>
      <OrderActions {...args} />
      <br />
      <OrderActions {...args} questionUrl="url" />
      <br />
      <OrderActions {...args} questionUrl="url" claimType="REFUND_REQUEST" cancelableDate={new Date().getTime()} />
      <br />
      <OrderActions {...args} questionUrl="url" claimType="EXCHANGE_REQUEST" />
      <br />
      <OrderActions {...args} questionUrl="url" deliveryType="PARCEL" deliveryUrl="url" />
      <br />
      <OrderActions {...args} questionUrl="url" deliveryType="DIRECT" />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  questionUrl: '1',
  claimType: 'RETURN_OR_EXCHANGE_REQUEST',
  claimUrl: '',
  deliveryType: 'DIRECT',
  deliveryUrl: '',
};
