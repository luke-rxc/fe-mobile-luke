import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AuthButton } from './AuthButton';

export default {
  title: 'Features/Live/AuthButton',
  component: AuthButton,
} as ComponentMeta<typeof AuthButton>;

const Template: ComponentStory<typeof AuthButton> = (args) => {
  return <AuthButton {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  text: '본인 인증',
  done: true,
  linkType: 'AUTH_SMS',
};
