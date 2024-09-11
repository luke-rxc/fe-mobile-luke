import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PrizmPayRegisterContent } from './PrizmPayRegisterContent';

export default {
  title: 'Features/MyPage/PrizmPayRegisterContent',
  component: PrizmPayRegisterContent,
} as ComponentMeta<typeof PrizmPayRegisterContent>;

const Template: ComponentStory<typeof PrizmPayRegisterContent> = (args) => {
  return <PrizmPayRegisterContent {...args} />;
};

export const Default = Template.bind({});
Default.args = {};
