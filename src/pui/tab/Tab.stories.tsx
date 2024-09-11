import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Tab } from './Tab';

export default {
  title: `${StoriesMenu.PDS.Navigation}/Tabs/Tab`,
  component: Tab,
  parameters: {
    design: [
      {
        name: 'figma - PDS',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=16051%3A48707',
      },
      {
        name: 'figma - 정책',
        type: 'figma',
        url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM?node-id=33124%3A199005',
      },
    ],
  },
} as ComponentMeta<typeof Tab>;

const Template: ComponentStory<typeof Tab> = ({ ...args }) => <Tab {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  label: 'Tab Label',
  selected: true,
};

export const bubble = Template.bind({});
bubble.args = {
  type: 'bubble',
  label: 'Tab Label',
  selected: true,
};
