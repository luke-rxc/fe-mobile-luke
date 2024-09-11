import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { PointListItem } from './PointListItem';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Point/PointListItem`,
  component: PointListItem,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7126%3A35319',
    },
  },
  args: {
    savedDate: new Date().getTime(),
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 0)).getTime(),
  },
} as ComponentMeta<typeof PointListItem>;

const Template: ComponentStory<typeof PointListItem> = ({ ...args }) => <PointListItem {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  title: '적립',
  point: 10000,
};

export const 포인트_적립 = Template.bind({});
포인트_적립.args = {
  title: '적립',
  point: 10000,
};

export const 포인트_소멸 = Template.bind({});
포인트_소멸.args = {
  title: '소멸',
  point: -10000,
};

export const 적립내역_여러줄 = Template.bind({});
적립내역_여러줄.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7486%3A32709',
  },
};
적립내역_여러줄.args = {
  title: new Array(100).fill('최대 2줄').join(' '),
  point: 1000,
};
