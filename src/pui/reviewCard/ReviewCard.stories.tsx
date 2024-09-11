import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { ReviewCard } from './ReviewCard';

export default {
  title: `${StoriesMenu.PDS.DataDisplayCardType}/ReviewCard`,
  component: ReviewCard,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=43513-73993&t=iSdSQzSW8blcm4c4-4',
    },
  },
} as ComponentMeta<typeof ReviewCard>;

const Template: ComponentStory<typeof ReviewCard> = ({ ...args }) => <ReviewCard {...args} />;

export const VideoType = Template.bind({});
VideoType.args = {
  media: {
    type: 'VIDEO',
    path: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
  },
  userNickname: 'Gerrard',
  userProfileImage: {
    src: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
    lazy: true,
  },
};

export const ImageType = Template.bind({});
ImageType.args = {
  media: {
    type: 'IMAGE',
    path: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
  },
  userNickname: 'Gerrard',
  userProfileImage: {
    src: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
    lazy: true,
  },
};

export const LongNickname = Template.bind({});
LongNickname.args = {
  media: {
    type: 'VIDEO',
    path: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
  },
  userNickname: 'Gerrard Gerrard Gerrard Gerrard Gerrard Gerrard',
  userProfileImage: {
    src: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
    lazy: true,
  },
};
