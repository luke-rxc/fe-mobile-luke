import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Button } from '@pui/button';
import { TextField } from './TextField';

export default {
  title: `${StoriesMenu.PDS.DataEntry}/Input & TextArea/TextField`,
  component: TextField,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7046%3A30885',
    },
  },
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = ({ ...args }) => <TextField {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  value: '',
  error: false,
  helperText: '',
  type: 'text',
  allowClear: false,
  suffix: null,
  multiline: false,
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
};

export const Multiline = Template.bind({});
Multiline.args = {
  value: '',
  error: false,
  helperText: '',
  type: 'text',
  allowClear: true,
  suffix: null,
  multiline: true,
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
};

export const TextArea = Template.bind({});
TextArea.args = {
  value: '',
  error: false,
  helperText: '',
  type: 'textarea',
  allowClear: false,
  suffix: null,
  multiline: false,
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
};

export const Suffix = Template.bind({});
Suffix.args = {
  value: '',
  error: false,
  helperText: '',
  type: 'text',
  allowClear: false,
  suffix: (
    <Button variant="tertiaryfill" size="squircle" bold>
      버튼
    </Button>
  ),
  multiline: false,
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
};
