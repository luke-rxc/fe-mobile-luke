import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Action } from '@pui/action';
import { Conditional } from './Conditional';

export default {
  title: `${StoriesMenu.NonPDS}/Conditional`,
  component: Conditional,
} as ComponentMeta<typeof Conditional>;

const Template: ComponentStory<typeof Conditional> = ({ ...args }) => <Conditional {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  condition: false,
  trueExp: <Action is="button" />,
  falseExp: <Action is="a" />,
  children: `참: <button /> || 거짓: <a />`,
};

export const OnlyTrue = Template.bind({});
OnlyTrue.parameters = {
  docs: {
    description: {
      story: '`false props`없이 `true props`만 사용한 경우 조건(`if`)이 `true`인 경우 렌더링',
    },
  },
};
OnlyTrue.args = {
  condition: true,
  trueExp: <Action is="button" />,
  children: `참`,
};
