import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Action } from './Action';

export default {
  title: `${StoriesMenu.NonPDS}/Action`,
  component: Action,
  argTypes: {
    is: {
      options: ['button', 'a'],
      control: { type: 'select' },
      description: '`button`과 `a`중 렌더할 HTML Tag를 선택할 수 있습니다.',
    },
  },
} as ComponentMeta<typeof Action>;

const Template: ComponentStory<typeof Action> = ({ ...args }) => <Action {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  children: 'React.Node',
};

export const Button = Template.bind({});
Button.args = {
  children: 'Button',
};

export const Anchor = Template.bind({});
Anchor.args = {
  is: 'a',
  link: 'https://naver.com',
  children: 'Anchor',
};
