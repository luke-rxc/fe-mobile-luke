import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Divider } from './Divider';

export default {
  title: `${StoriesMenu.NonPDS}/Divider`,
  component: Divider,
  argTypes: {
    is: { control: { type: 'select' } },
  },
} as ComponentMeta<typeof Divider>;

const Template: ComponentStory<typeof Divider> = ({ ...args }) => <Divider {...args} />;

export const 기본 = Template.bind({});
기본.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=29847-109777&mode=design&t=IQ5VpLoLHbyJRNeO-4',
  },
};
기본.args = {
  is: 'span',
  t: 0,
  r: 2.4,
  b: 0,
  l: 2.4,
};
