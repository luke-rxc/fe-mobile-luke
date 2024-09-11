import { StoriesMenu } from '@stories/menu';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SectionItem } from './SectionItem';

export default {
  title: `${StoriesMenu.Apps}/Showroom/components/SectionItem`,
  component: SectionItem,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?node-id=43557%3A171084&t=sfPhNKzNeMrjLsmw-4',
    },
  },
} as ComponentMeta<typeof SectionItem>;

const Template: ComponentStory<typeof SectionItem> = ({ ...args }) => <SectionItem {...args} />;

export const 상품_섹션 = Template.bind({});

상품_섹션.args = {
  sectionId: 1,
  sectionLink: '/',
  title: 'title',
  type: 'GOODS',
  content: new Array(8).fill({}).map((__, i) => ({
    goodsId: `${i}`,
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
};
