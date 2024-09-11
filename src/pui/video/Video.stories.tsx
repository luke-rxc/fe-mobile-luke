import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Video } from './Video';

export default {
  title: `${StoriesMenu.NonPDS}/Video`,
  component: Video,
  argTypes: {},
  parameters: {},
} as ComponentMeta<typeof Video>;

const Template: ComponentStory<typeof Video> = ({ ...args }) => (
  <div style={{ width: 400 }}>
    <Video {...args} />
  </div>
);

export const 기본 = Template.bind({});
기본.args = {
  src: 'https://cdn-image.prizm.co.kr/story/20220713/9a4c9046-b93f-4499-91bd-25bc252a4ebb/1080.mp4',
  lazy: false,
  autoPlay: true,
  loop: true,
};
export const lazy = Template.bind({});
lazy.args = {
  src: 'https://cdn-image.prizm.co.kr/story/20220713/9a4c9046-b93f-4499-91bd-25bc252a4ebb/1080.mp4',
  lazy: true,
  autoPlay: true,
  loop: true,
};

export const poster = Template.bind({});
poster.args = {
  src: 'https://cdn-image.prizm.co.kr/story/20220713/9a4c9046-b93f-4499-91bd-25bc252a4ebb/1080.mp4',
  lazy: true,
  poster: 'https://cdn-image-dev.prizm.co.kr/story/20220630/a2544373-fe80-4206-b549-0ed213ae8e45/1080.0000000.jpg',
  autoPlay: true,
  loop: true,
};

export const blurHash = Template.bind({});
blurHash.args = {
  src: 'https://cdn-image.prizm.co.kr/story/20220713/9a4c9046-b93f-4499-91bd-25bc252a4ebb/1080.mp4',
  lazy: true,
  blurHash: 'UIR3TXxu%MM{%Lj[WCa|~pNGIUxuD%WBofj?',
  autoPlay: true,
  loop: true,
};
