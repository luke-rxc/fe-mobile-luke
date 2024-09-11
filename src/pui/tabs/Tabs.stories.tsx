import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { SortingOptions } from '@constants/goods';
import { Tabs } from './Tabs';

export default {
  title: `${StoriesMenu.PDS.Navigation}/Tabs/Tabs`,
  component: Tabs,
  parameters: {
    design: [
      {
        name: 'Tab',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=7034-29537&t=fiDfe6A3MTRMXVlw-4',
      },
      {
        name: 'Bubble > Sorting 정책',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=27596-97455&t=fiDfe6A3MTRMXVlw-4',
      },
    ],
  },
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = ({ ...args }) => <Tabs {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  data: ['Tab Label1', 'Tab Label2', 'Tab Label3'],
  value: 1,
};

export const bubble = Template.bind({});
bubble.args = {
  data: ['Tab Label1', 'Tab Label2', 'Tab Label3'],
  type: 'bubble',
  value: 1,
};

export const bubbleSorting = Template.bind({});
bubbleSorting.args = {
  data: ['전체', 'Filter1', 'Filter2', 'Filter3', 'Filter4', 'Filter5', 'Filter6', 'Filter7'],
  type: 'bubble',
  value: 1,
  sortingOptions: SortingOptions,
};

export const overflow = Template.bind({});
overflow.args = {
  data: new Array(100).fill('').map((_, i) => i),
  value: 1,
};
