import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { VideoPlayer } from './VideoPlayer';

export default {
  title: `${StoriesMenu.Features}/VideoPlayer/VideoPlayer`,
  component: VideoPlayer,
  parameters: {
    design: {
      type: 'figma',
      // TODO: figma 정의 필요
      url: '',
    },
  },
} as ComponentMeta<typeof VideoPlayer>;

const Template: ComponentStory<typeof VideoPlayer> = ({ ...args }) => (
  <div style={{ width: 350 }}>
    <VideoPlayer {...args} />
  </div>
);

const video = {
  src: 'https://cdn-image-dev.prizm.co.kr/story/20230905/e72ce42f-e4fc-4a63-8888-33580f55d4da/1080.mp4',
  poster: 'https://cdn-image-dev.prizm.co.kr/story/20230905/e72ce42f-e4fc-4a63-8888-33580f55d4da/1080.0000000.jpg',
  width: 1080,
  height: 1440,
  loop: true,
};
export const 비디오_플레이어 = Template.bind({});
비디오_플레이어.args = {
  video: {
    ...video,
    autoPlay: false,
  },
};

export const 비디오_플레이어_자동재생2 = Template.bind({});
비디오_플레이어_자동재생2.args = {
  video: {
    ...video,
    autoPlay: true,
    muted: false, // 자동재생인 경우는 ios 브라우저 정책 이슈로 muted설정에 상관없이 초기 음소거 처리
  },
};
