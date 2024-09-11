import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Profiles } from './Profiles';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Profile/Profiles`,
  component: Profiles,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=33%3A307',
    },
  },
} as ComponentMeta<typeof Profiles>;

const Template: ComponentStory<typeof Profiles> = ({ ...args }) => <Profiles {...args} />;

const imageInfo = {
  src: 'https://cdn-image.prizm.co.kr/goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
  lazy: true,
};
export const 프로필 = Template.bind({});
프로필.args = {
  showroomCode: 'uuuuu',
  liveId: 123,
  image: imageInfo,
  size: '144',
  status: 'none',
  colorCode: '',
};

export const 프로필_LIVE = Template.bind({});
프로필_LIVE.args = {
  showroomCode: 'uuuuu',
  liveId: 123,
  image: imageInfo,
  size: '144',
  status: 'live',
};

export const 프로필_NEW = Template.bind({});
프로필_NEW.args = {
  showroomCode: 'uuuuu',
  liveId: 123,
  image: imageInfo,
  size: '144',
  status: 'new',
};

export const 프로필_로띠컬러 = Template.bind({});
프로필_로띠컬러.args = {
  showroomCode: 'uuuuu',
  liveId: 123,
  image: imageInfo,
  size: '144',
  status: 'live',
  colorCode: '#00ff00',
};

export const 프로필_링크비활성 = Template.bind({});
프로필_링크비활성.args = {
  showroomCode: 'uuuuu',
  liveId: 123,
  image: imageInfo,
  size: '144',
  status: 'live',
  disabledLink: true,
};
