import { StoriesMenu } from '@stories/menu';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SectionHeader } from './SectionHeader';

export default {
  title: `${StoriesMenu.Apps}/Showroom/components/SectionHeader`,
  component: SectionHeader,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?type=design&node-id=54620-355348&mode=design&t=hGCzTtV5FR9ISD95-4',
    },
  },
} as ComponentMeta<typeof SectionHeader>;

const Template: ComponentStory<typeof SectionHeader> = ({ ...args }) => <SectionHeader {...args} />;

export const 편성_1개 = Template.bind({});

편성_1개.args = {
  section: {
    type: 'GOODS',
    title: '섹션 타이틀',
    sectionId: 1,
    content: [],
    headerList: [
      {
        id: 21202,
        title: '헤더\n타이틀',
        landingLink: '',
        image: {
          src: 'https://cdn-image.prizm.co.kr/story/20220714/8cc2b96b-90b4-4399-b5c5-8ecb4f017875.jpeg',
          blurHash: 'L58W~t?HMxsC00j]t7og?wI:o#S4',
        },
      },
    ],
  },
};

export const 편성_2개_이상 = Template.bind({});

편성_2개_이상.args = {
  section: {
    type: 'GOODS',
    title: '섹션 타이틀',
    sectionId: 1,
    content: [],
    headerList: [
      {
        id: 21202,
        title: '헤더\n타이틀',
        landingLink: '',
        image: {
          src: 'https://cdn-image.prizm.co.kr/story/20220714/8cc2b96b-90b4-4399-b5c5-8ecb4f017875.jpeg',
          blurHash: 'L58W~t?HMxsC00j]t7og?wI:o#S4',
        },
      },
      {
        id: 21202,
        title: '헤더\n타이틀',
        landingLink: '',
        image: {
          src: 'https://cdn-image.prizm.co.kr/story/20220714/8cc2b96b-90b4-4399-b5c5-8ecb4f017875.jpeg',
          blurHash: 'L58W~t?HMxsC00j]t7og?wI:o#S4',
        },
      },
      {
        id: 21202,
        title: '헤더\n타이틀',
        landingLink: '',
        image: {
          src: 'https://cdn-image.prizm.co.kr/story/20220714/8cc2b96b-90b4-4399-b5c5-8ecb4f017875.jpeg',
          blurHash: 'L58W~t?HMxsC00j]t7og?wI:o#S4',
        },
      },
    ],
  },
};

export const 타이틀_X = Template.bind({});

타이틀_X.args = {
  section: {
    type: 'GOODS',
    title: '섹션 타이틀',
    sectionId: 1,
    content: [],
    headerList: [
      {
        id: 21202,
        title: '',
        landingLink: '',
        image: {
          src: 'https://cdn-image.prizm.co.kr/story/20220714/8cc2b96b-90b4-4399-b5c5-8ecb4f017875.jpeg',
          blurHash: 'L58W~t?HMxsC00j]t7og?wI:o#S4',
        },
      },
      {
        id: 21202,
        title: '',
        landingLink: '',
        image: {
          src: 'https://cdn-image.prizm.co.kr/story/20220714/8cc2b96b-90b4-4399-b5c5-8ecb4f017875.jpeg',
          blurHash: 'L58W~t?HMxsC00j]t7og?wI:o#S4',
        },
      },
      {
        id: 21202,
        title: '',
        landingLink: '',
        image: {
          src: 'https://cdn-image.prizm.co.kr/story/20220714/8cc2b96b-90b4-4399-b5c5-8ecb4f017875.jpeg',
          blurHash: 'L58W~t?HMxsC00j]t7og?wI:o#S4',
        },
      },
    ],
  },
};
