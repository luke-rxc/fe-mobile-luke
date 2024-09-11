import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AuthComplete } from './AuthComplete';

export default {
  title: 'Features/Live/AuthComplete',
  component: AuthComplete,
} as ComponentMeta<typeof AuthComplete>;

const Template: ComponentStory<typeof AuthComplete> = (args) => {
  return <AuthComplete {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  isCompleted: false,
  onClick: () => null,
};
