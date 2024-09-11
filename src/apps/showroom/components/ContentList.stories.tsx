import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { ContentList } from './ContentList';

const content = {
  contentType: 'STORY',
  contentCode: 'elliecontent',
  title: '파이널티켓 프리즘 X 워터밤',
  image: {
    src: 'https://cdn-image.prizm.co.kr/story/20220714/8cc2b96b-90b4-4399-b5c5-8ecb4f017875.jpeg',
    blurHash: 'L58W~t?HMxsC00j]t7og?wI:o#S4',
  },
};

export default {
  title: `${StoriesMenu.Apps}/Showroom/components/ContentList`,
  component: ContentList,
  parameters: {
    design: [
      {
        type: 'figma',
        name: '일반/PGM 정책',
        url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?node-id=43539%3A169556&t=n5v0nCIZZs4ZVHgV-4',
      },
      {
        type: 'figma',
        name: '일반/PGM 쇼룸 화면',
        url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?node-id=16464%3A112541&t=n5v0nCIZZs4ZVHgV-4',
      },
      {
        type: 'figma',
        name: '콘셉트 쇼룸 정책',
        url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?node-id=43557%3A170926&t=n5v0nCIZZs4ZVHgV-4',
      },
      {
        type: 'figma',
        name: '콘셉트 쇼룸 화면',
        url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?node-id=43557%3A170642&t=n5v0nCIZZs4ZVHgV-4',
      },
    ],
  },
} as ComponentMeta<typeof ContentList>;

const Template: ComponentStory<typeof ContentList> = ({ ...args }) => <ContentList {...args} />;

export const 단일_콘텐츠 = Template.bind({});
단일_콘텐츠.args = {
  contents: [content],
};

export const 다수_콘텐츠 = Template.bind({});
다수_콘텐츠.args = {
  contents: [content, content, content],
};

export const 전체_링크O = Template.bind({});
전체_링크O.args = {
  contents: [content, content, content, content, content],
  sectionLink: '/',
};
