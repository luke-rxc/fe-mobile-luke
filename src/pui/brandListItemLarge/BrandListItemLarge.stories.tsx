import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { BrandListItemLarge } from './BrandListItemLarge';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Brand/BrandListItemLarge`,
  component: BrandListItemLarge,
  parameters: {
    design: [
      {
        name: 'figma - PDS',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=6004%3A22731',
      },
      {
        name: 'figma - pressed',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7126%3A30556',
      },
    ],
  },
  args: {
    title: 'Brand Title',
    followed: false,
    onAir: false,
    liveId: 123,
    showroomCode: 'test',
    imageURL: '/showroom/20220727/9a5a61d0-70fc-464e-b01d-cd9cc89d919c.jpeg',
  },
} as ComponentMeta<typeof BrandListItemLarge>;

const Template: ComponentStory<typeof BrandListItemLarge> = ({ ...args }) => <BrandListItemLarge {...args} />;

export const 기본 = Template.bind({});

export const 라이브 = Template.bind({});
라이브.args = {
  onAir: true,
  mainColorCode: '#2348c2',
};

export const 팔로잉 = Template.bind({});
팔로잉.args = {
  followed: true,
};
