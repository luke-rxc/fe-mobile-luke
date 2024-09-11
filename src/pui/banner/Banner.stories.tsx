import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Bell } from '@pui/icon';
import { Banner } from './Banner';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Banner/Banner`,
  component: Banner,
  parameters: {
    design: [
      {
        name: 'figma - PDS',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=29920-114003&mode=dev',
      },
    ],
  },
} as ComponentMeta<typeof Banner>;

const Template: ComponentStory<typeof Banner> = ({ ...args }) => <Banner {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  title: '설정을 변경해주세요',
  description: '알림이 차단되어 있습니다',
  link: '',
  suffix: '값',
  icon: Bell,
};

export const 설명_제외 = Template.bind({});
설명_제외.args = {
  title: '설정을 변경해주세요',
  link: 'https://mweb.prizm.co.kr',
  suffix: '값',
  icon: Bell,
};

export const 화살표_제외 = Template.bind({});
화살표_제외.args = {
  title: '설정을 변경해주세요',
  description: 'noArrow는 suffix 무시',
  link: '',
  suffix: '값',
  noArrow: true,
};
