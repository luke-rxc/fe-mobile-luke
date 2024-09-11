import { StoriesMenu } from '@stories/menu';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Slot } from './Slot';

export default {
  title: `${StoriesMenu.NonPDS}/Slot`,
  component: Slot,
  args: {
    value: 240000,
    initialValue: 0,
    prefix: undefined,
    suffix: '원',
  },
} as ComponentMeta<typeof Slot>;

const Template: ComponentStory<typeof Slot> = ({ ...args }) => <Slot {...args} />;

export const 기본 = Template.bind({});
기본.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=31287-46191&mode=design&t=qmUp1PJLoXgd6Fy2-4',
  },
};
