import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { BrandCard } from './BrandCard';

export default {
  title: `${StoriesMenu.PDS.DataDisplayCardType}/Brand/BrandCard`,
  component: BrandCard,
  parameters: {
    design: [
      {
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=1782%3A2695',
      },
      {
        name: 'figma - pressed',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7308%3A30427',
      },
    ],
  },
  args: {
    title: 'Brand Title',
    description: 'description',
    followed: false,
    onAir: false,
    liveId: 123,
    showroomCode: 'test',
    imageURL: '/showroom/20220727/9a5a61d0-70fc-464e-b01d-cd9cc89d919c.jpeg',
    mainColorCode: '#ff00ff',
    disabledFollow: false,
  },
} as ComponentMeta<typeof BrandCard>;

const Template: ComponentStory<typeof BrandCard> = ({ ...args }) => <BrandCard {...args} />;

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

export const 팔로우버튼_비활성화 = Template.bind({});
팔로우버튼_비활성화.args = {
  disabledFollow: true,
};

export const 서브타이틀_없을때 = Template.bind({});
서브타이틀_없을때.args = {
  description: undefined,
};

export const 긴_문자열 = Template.bind({});
긴_문자열.args = {
  title: new Array(20).fill('Brand Title').join(' '),
  description: new Array(20).fill('description').join(' '),
};

export const 스몰사이즈 = Template.bind({});
스몰사이즈.args = {
  size: 'small',
};
