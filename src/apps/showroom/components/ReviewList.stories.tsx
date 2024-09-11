import { StoriesMenu } from '@stories/menu';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ReviewList } from './ReviewList';

export default {
  title: `${StoriesMenu.Apps}/Showroom/components/ReviewList`,
  component: ReviewList,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?type=design&node-id=54620-355348&mode=design&t=hGCzTtV5FR9ISD95-4',
    },
  },
} as ComponentMeta<typeof ReviewList>;

const Template: ComponentStory<typeof ReviewList> = ({ ...args }) => <ReviewList {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  reviews: [
    {
      media: {
        type: 'VIDEO',
        path: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
      },
      userNickname: 'Gerrard',
      userProfileImage: {
        src: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
        lazy: true,
      },
    },
    {
      media: {
        type: 'VIDEO',
        path: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
      },
      userNickname: 'Gerrard',
      userProfileImage: {
        src: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
        lazy: true,
      },
    },
    {
      media: {
        type: 'VIDEO',
        path: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
      },
      userNickname: 'Gerrard',
      userProfileImage: {
        src: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
        lazy: true,
      },
    },
    {
      media: {
        type: 'VIDEO',
        path: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
      },
      userNickname: 'Gerrard',
      userProfileImage: {
        src: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
        lazy: true,
      },
    },
    {
      media: {
        type: 'VIDEO',
        path: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
      },
      userNickname: 'Gerrard',
      userProfileImage: {
        src: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
        lazy: true,
      },
    },
    {
      media: {
        type: 'VIDEO',
        path: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
      },
      userNickname: 'Gerrard',
      userProfileImage: {
        src: 'goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
        lazy: true,
      },
    },
  ],
};
