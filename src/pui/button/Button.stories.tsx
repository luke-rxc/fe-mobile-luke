import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Like, ChevronRight } from '@pui/icon';
import { Button } from './Button';

export default {
  title: `${StoriesMenu.PDS.Button}/ButtonGeneral/Button`,
  component: Button,
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
    size: 'large',
    variant: 'none',
    prefix: undefined,
    suffix: undefined,
    children: 'Button',
    description: undefined,
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = ({ ...args }) => <Button {...args} />;

export const 기본 = Template.bind({});
기본.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=8061%3A38963',
  },
};

export const primary = Template.bind({});
primary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=8003%3A38631',
  },
};
primary.args = {
  variant: 'primary',
};

export const secondary = Template.bind({});
secondary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7335%3A30822',
  },
};
secondary.args = {
  variant: 'secondary',
};

export const tertiaryline = Template.bind({});
tertiaryline.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=8003%3A38632',
  },
};
tertiaryline.args = {
  variant: 'tertiaryline',
};

export const tertiaryfill = Template.bind({});
tertiaryfill.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=8003%3A38633',
  },
};
tertiaryfill.args = {
  variant: 'tertiaryfill',
};

export const bubble = Template.bind({});
bubble.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=8016%3A39122',
  },
};
bubble.args = {
  size: 'bubble',
  variant: 'primary',
};

export const squircle = Template.bind({});
squircle.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=8016%3A39122',
  },
};
squircle.args = {
  size: 'squircle',
  variant: 'primary',
};

export const selected = Template.bind({});
selected.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=8016%3A39126',
  },
};
selected.args = {
  bold: true,
  selected: true,
  size: 'bubble',
  variant: 'primary',
};

export const leftIcon = Template.bind({});
leftIcon.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=8003%3A38103',
  },
};
leftIcon.args = {
  prefix: <Like size="1.8rem" />,
  children: 'Label',
};

export const rightIcon = Template.bind({});
rightIcon.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=8003%3A38103',
  },
};
rightIcon.args = {
  suffix: <ChevronRight size="1.8rem" />,
  children: 'Label',
};

export const description = Template.bind({});
description.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=8003%3A38103',
  },
};
description.args = {
  size: 'large',
  variant: 'primary',
  children: '구매',
  description: '20,000원',
};
