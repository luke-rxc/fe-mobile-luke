import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { ContentCardSmall } from './ContentCardSmall';

export default {
  title: `${StoriesMenu.PDS.DataDisplayCardType}/Content/ContentCardSmall`,
  component: ContentCardSmall,
  parameters: {
    design: [
      {
        name: 'figma - PDS',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=14289%3A48003',
      },
      {
        name: 'figma - 공개예정',
        type: 'figma',
        url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM?node-id=32526%3A172789',
      },
      {
        name: 'figma - confirm',
        type: 'figma',
        url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM?node-id=32526%3A173459',
      },
    ],
  },
  args: {
    title: '가나다라마바',
    startDate: new Date(),
    contentCode: 'contentCode',
    contentType: 'TEASER',
    imageURL: 'https://cdn-image.prizm.co.kr/showroom/20220727/9a5a61d0-70fc-464e-b01d-cd9cc89d919c.jpeg',
    blurHash: 'LEHLk~WB2yk8pyo0adR*.7kCMdnj',
    showroomCode: 'showroomCode',
  },
} as ComponentMeta<typeof ContentCardSmall>;

const Template: ComponentStory<typeof ContentCardSmall> = ({ ...args }) => <ContentCardSmall {...args} />;

export const 기본 = Template.bind({});

export const 공개예정 = Template.bind({});
공개예정.args = {
  startDate: new Date().setDate(new Date().getDate() + 1),
};

export const 제목2줄 = Template.bind({});
제목2줄.args = {
  title: '제목2줄 제목2줄 제목2줄 제목2줄 제목2줄 제목2줄',
};
