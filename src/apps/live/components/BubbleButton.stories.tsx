import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { BubbleButton } from './BubbleButton';

export default {
  title: `${StoriesMenu.PDS.Button}/Button_Bubble,Squircle/BubbleButton`,
  component: BubbleButton,
  argTypes: {
    is: {
      options: ['button', 'a'],
      control: { type: 'select' },
    },
    size: {
      control: { type: 'radio' },
    },
  },
  args: {
    noPress: false,
    block: false,
    bold: false,
    loading: false,
    disabled: false,
    selected: false,
    size: 'small',
    variant: 'primary',
    // prefix: undefined,
    // suffix: undefined,
    children: 'Button',
  },
} as ComponentMeta<typeof BubbleButton>;

const Template: ComponentStory<typeof BubbleButton> = ({ ...args }) => <BubbleButton {...args} />;

export const primary = Template.bind({});
primary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=20%3A371',
  },
};
primary.args = {
  variant: 'primary',
};

export const secondary = Template.bind({});
secondary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=5528%3A23576',
  },
};
secondary.args = {
  variant: 'secondary',
};

export const tertiaryline = Template.bind({});
tertiaryline.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=1887%3A2688',
  },
};
tertiaryline.args = {
  variant: 'tertiaryline',
};

export const tertiaryfill = Template.bind({});
tertiaryfill.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=6078%3A25861',
  },
};
tertiaryfill.args = {
  variant: 'tertiaryfill',
};

export const selected = Template.bind({});
selected.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=9586%3A50545',
  },
};
selected.args = {
  bold: true,
  selected: true,
  variant: 'primary',
};
