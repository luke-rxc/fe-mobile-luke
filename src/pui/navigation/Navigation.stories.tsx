import { createGlobalStyle } from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Navigation } from './Navigation';

const GlobalStyle = createGlobalStyle`
  html, body {
    padding: 0 !important;
  }
  #root:after{
    display: block;
    height: 500vh;
    background: url(https://cdn-image.prizm.co.kr/goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg);
    content: '';
  }
`;

export default {
  title: `${StoriesMenu.NonPDS}/Navigation`,
  component: Navigation,
  parameters: { docs: { inlineStories: false, iframeHeight: '720px' } },
  args: {
    open: true,
  },
} as ComponentMeta<typeof Navigation>;

const Template: ComponentStory<typeof Navigation> = (args) => {
  return (
    <>
      <GlobalStyle />
      <Navigation {...args} />
    </>
  );
};

export const 기본 = Template.bind({});
기본.args = {};

export const 로그인 = Template.bind({});
로그인.args = {
  userInfo: {
    nickname: 'Username',
    profileImage: '',
  },
};
