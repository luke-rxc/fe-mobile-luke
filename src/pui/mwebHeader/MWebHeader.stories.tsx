import styled, { createGlobalStyle } from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Action } from '@pui/action';
import { Hamburger } from '@pui/icon';
import { MWebHeader } from './MWebHeader';

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

const UtilItem = styled(({ className }) => {
  return <Action className={className} children={<Hamburger />} />;
})`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4.8rem;
  height: 4.8rem;
`;

export default {
  title: `${StoriesMenu.PDS.Navigation}/TopBar/MWebHeader`,
  component: MWebHeader,
  parameters: {
    docs: { inlineStories: false, iframeHeight: '300px' },
    design: {
      type: 'link',
      url: 'https://www.notion.so/rxc/MWeb-Header-Scrolling-89c7bc5c7baa4ffeb5f8be5f2fe8926b',
    },
  },
} as ComponentMeta<typeof MWebHeader>;

const Template: ComponentStory<typeof MWebHeader> = (args) => (
  <>
    <GlobalStyle />
    <MWebHeader {...args} />
  </>
);

export const 기본 = Template.bind({});
기본.args = {};

export const overlay = Template.bind({});
overlay.args = {
  overlay: true,
};

export const 유틸사용 = Template.bind({});
유틸사용.args = {
  overlay: true,
  utils: <UtilItem />,
};

export const 텍스트타이틀 = Template.bind({});
텍스트타이틀.args = {
  title: '프리즘',
};

export const SVG타이틀 = Template.bind({});
SVG타이틀.args = {
  titleImagePath: 'https://cdn-image.prizm.co.kr/brand/20220503/f453be1c-fb6d-44b7-9039-1c3f16fe205b.svg',
};
