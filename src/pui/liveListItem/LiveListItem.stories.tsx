import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { LiveListItem } from './LiveListItem';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Live/LiveListItem`,
  component: LiveListItem,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=14276%3A46802',
    },
  },
  args: {
    onAir: false,
    liveId: 21373,
    contentCode: 'wowdraw3rd',
    contentType: 'TEASER',
    scheduleId: 90,
    title: '4월 4주차 #입생로랑 #샤넬클래식',
    scheduleDate: new Date().getTime(),
    logoURL: 'https://cdn-image.prizm.co.kr/brand/20220221/dfe46d2f-6a37-4e58-8d13-786d4eef0bb7.svg',
    chromakeyURL: 'https://cdn-image-dev.prizm.co.kr/schedule/20220803/694d3262-284c-47e6-b9d9-f0c11f9be854.png',
    backgroundURL: 'https://cdn-image-dev.prizm.co.kr/schedule/20220803/814d24ee-8d00-4fed-b241-140902f51ab4.jpg',
    followed: false,
    onChangeFollow: (followed: boolean) => alert(`현재 구독 여부: ${followed}`),
  },
  argTypes: {},
} as ComponentMeta<typeof LiveListItem>;

const Template: ComponentStory<typeof LiveListItem> = (args) => {
  return <LiveListItem {...args} />;
};

export const 기본 = Template.bind({});
기본.args = {};

export const 제목_말줄임 = Template.bind({});
제목_말줄임.args = {
  title: new Array(10).fill('4월 4주차 #입생로랑 #샤넬클래식').join(' '),
};

export const 긴_브랜드_로고 = Template.bind({});
긴_브랜드_로고.args = {
  logoURL: 'https://cdn-image.prizm.co.kr/brand/20220222/7a99afc8-5df4-4cc7-ae38-4dcc74e16a7a.svg',
};

export const 알림_받는_중 = Template.bind({});
알림_받는_중.args = {
  followed: true,
};

export const 브랜드_라이브_중 = Template.bind({});
브랜드_라이브_중.args = {
  onAir: true,
  showroomCode: '쇼룸코드',
  showroomName: '와우드로우',
  profileURL: 'https://cdn-image.prizm.co.kr/goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
};
