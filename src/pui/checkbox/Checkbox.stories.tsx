import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Checkbox } from './Checkbox';

export default {
  title: `${StoriesMenu.PDS.DataEntry}/Checkbox/Checkbox`,
  component: Checkbox,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7006%3A30681',
    },
  },
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = ({ ...args }) => <Checkbox {...args} />;

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
    '체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨 체크박스 라벨',
};
