import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { OrderAction, OrderActionComponent } from './OrderAction';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/OrderAction`,
  component: OrderAction,
} as ComponentMeta<typeof OrderActionComponent>;

const Template: ComponentStory<typeof OrderActionComponent> = (args) => {
  return (
    <>
      <OrderAction {...args} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  block: true,
  size: 'medium',
  variant: 'tertiaryline',
  label: 'asdfasd',
  description: '~ 2030.3.3',
};
