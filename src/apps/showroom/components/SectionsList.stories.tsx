import { StoriesMenu } from '@stories/menu';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SectionsList } from './SectionsList';

export default {
  title: `${StoriesMenu.Apps}/Showroom/components/SectionsList`,
  component: SectionsList,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?node-id=43557%3A171084&t=sfPhNKzNeMrjLsmw-4',
    },
  },
} as ComponentMeta<typeof SectionsList>;

const Template: ComponentStory<typeof SectionsList> = ({ ...args }) => <SectionsList {...args} />;

export const 기본 = Template.bind({});

기본.args = {
  sections: new Array(8).fill({}).map((_, sectionId) => ({
    sectionId: `${sectionId}`,
    sectionLink: '/',
    title: 'title',
    type: 'GOODS',
    content: new Array(8).fill({}).map((__, goodsId) => ({
      goodsId: `${goodsId}`,
      code: 'goodsCode',
      goodsName: 'Holiday Signature boll',
      brandName: '브랜드 이름 ABC',
      price: 10000,
      discountRate: 5,
      imageUrl: 'https://cdn-dev.prizm.co.kr/provider/20210909/34427c78-fe8a-4a5b-b9d7-b04e1b4c9a3b',
      imageProps: {
        isLazy: true,
        blurHash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
      },
    })),
  })),
};
