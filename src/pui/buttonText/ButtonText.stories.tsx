import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { ButtonText, ButtonTextComponent } from './ButtonText';

export default {
  title: `${StoriesMenu.PUI}/ButtonText`,
  component: ButtonText,
  parameters: {
    design: [
      {
        name: 'figma - PDS',
        type: 'figma',
        url: 'figma url',
      },
    ],
  },
} as ComponentMeta<typeof ButtonTextComponent>;

const Template: ComponentStory<typeof ButtonTextComponent> = ({ ...args }) => <ButtonText {...args} />;

export const 기본 = Template.bind({});

기본.args = {
  children: 'text',
};
