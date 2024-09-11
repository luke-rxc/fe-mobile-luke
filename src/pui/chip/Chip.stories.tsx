import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Chip } from './Chip';

export default {
  title: `${StoriesMenu.PDS.DataEntry}/Chips/Chip`,
  component: Chip,
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
} as ComponentMeta<typeof Chip>;

const Template: ComponentStory<typeof Chip> = ({ ...args }) => <Chip {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  label: 'Label',
  onDelete: undefined,
};

export const 텍스트_20자_초과 = Template.bind({});
텍스트_20자_초과.args = {
  label: '123456789012345678901234',
  onDelete: undefined,
};

export const deletable = Template.bind({});
deletable.args = {
  label: '123456789012345678901234',
  onDelete: () => alert('delate'),
};

export const clickable = Template.bind({});
clickable.args = {
  label: '123456789012345678901234',
  onClick: () => alert('click'),
  onDelete: undefined,
};

export const link = Template.bind({});
link.args = {
  label: '123456789012345678901234',
  link: 'https://prizm.co.kr',
  onDelete: undefined,
};

export const clickableAndDeletable = Template.bind({});
clickableAndDeletable.args = {
  label: '123456789012345678901234',
  onClick: () => alert('click'),
  onDelete: () => alert('delete'),
};

export const clickableAndLinkAndDeletable = Template.bind({});
clickableAndLinkAndDeletable.args = {
  label: '123456789012345678901234',
  link: 'https://prizm.co.kr',
  onClick: () => alert('click'),
  onDelete: () => alert('delete'),
};
