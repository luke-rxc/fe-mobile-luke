import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { ContentType } from '@constants/content';
import { ContentCard } from './ContentCard';

export default {
  title: `${StoriesMenu.PDS.DataDisplayCardType}/Content/ContentCard`,
  component: ContentCard,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7273%3A30763',
    },
  },
} as ComponentMeta<typeof ContentCard>;

const Template: ComponentStory<typeof ContentCard> = ({ ...args }) => <ContentCard {...args} />;

const contentCardDefault = {
  contentType: ContentType.STORY,
  contentCode: 'elliecontent',
  title: '파이널티켓 프리즘 X 워터밤',
  image: {
    src: 'https://cdn-image.prizm.co.kr/story/20220714/8cc2b96b-90b4-4399-b5c5-8ecb4f017875.jpeg',
    blurHash: 'L58W~t?HMxsC00j]t7og?wI:o#S4',
  },
};
const currentTime = new Date().getTime();

export const 컨텐츠공개 = Template.bind({});
컨텐츠공개.args = {
  ...contentCardDefault,
  layoutType: 'none',
  startDate: currentTime,
};
컨텐츠공개.decorators = [
  (Story) => (
    <div style={{ width: '327px' }}>
      <Story />
    </div>
  ),
];

export const Swipe레이아웃 = Template.bind({});
Swipe레이아웃.args = {
  ...contentCardDefault,
  layoutType: 'swipe',
  startDate: currentTime,
};
Swipe레이아웃.decorators = [
  (Story) => (
    <div style={{ width: '256px' }}>
      <Story />
    </div>
  ),
];

export const 컨텐츠공개전 = Template.bind({});
컨텐츠공개전.args = {
  ...contentCardDefault,
  layoutType: 'none',
  startDate: currentTime + 24 * 60 * 60 * 1000,
  endDate: currentTime + 24 * 60 * 60 * 1000 * 2,
};
컨텐츠공개전.decorators = [
  (Story) => (
    <div style={{ width: '327px' }}>
      <Story />
    </div>
  ),
];

export const 컨텐츠공개10분전 = Template.bind({});
컨텐츠공개10분전.args = {
  ...contentCardDefault,
  layoutType: 'none',
  startDate: currentTime + 10 * 60 * 1000 + 3000,
  endDate: currentTime + 24 * 60 * 60 * 1000 * 2,
};
컨텐츠공개10분전.decorators = [
  (Story) => (
    <div style={{ width: '327px' }}>
      <Story />
    </div>
  ),
];

export const 컨텐츠공개중_종료일 = Template.bind({});
컨텐츠공개중_종료일.args = {
  ...contentCardDefault,
  layoutType: 'none',
  startDate: currentTime,
  endDate: currentTime + 24 * 60 * 60 * 1000 * 2,
};
컨텐츠공개중_종료일.decorators = [
  (Story) => (
    <div style={{ width: '327px' }}>
      <Story />
    </div>
  ),
];
