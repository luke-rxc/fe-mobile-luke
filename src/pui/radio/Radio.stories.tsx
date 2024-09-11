import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Radio } from './Radio';

export default {
  title: `${StoriesMenu.PDS.DataEntry}/Radio/Radio`,
  component: Radio,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=29901-105050&mode=design&t=kYo4A5peRLYBRmzv-4',
    },
  },
} as ComponentMeta<typeof Radio>;

const Template: ComponentStory<typeof Radio> = ({ ...args }) => <Radio {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  block: false,
  align: 'center',
  label: '',
};

export const Checked = Template.bind({});
Checked.args = {
  block: false,
  checked: true,
  align: 'center',
  label: '',
};

export const Disabled = Template.bind({});
Disabled.args = {
  block: false,
  disabled: true,
  align: 'center',
  label: '',
};

export const CheckedDisabled = Template.bind({});
CheckedDisabled.args = {
  block: false,
  checked: true,
  disabled: true,
  align: 'center',
  label: '',
};

export const Label = Template.bind({});
Label.args = {
  block: false,
  align: 'center',
  label:
    '라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨 라디오 라벨',
};
