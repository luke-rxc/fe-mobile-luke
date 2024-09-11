import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { GoodsCardMini } from './GoodsCardMini';

export default {
  title: `${StoriesMenu.PDS.DataDisplayCardType}/Goods/GoodsCardMini`,
  component: GoodsCardMini,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=14278%3A47315',
    },
  },
  args: {
    goodsCode: 'goodsCode',
    goodsName: 'Holiday',
    price: 10000,
    discountRate: 5,
    image: {
      src: '/showroom/20220727/9a5a61d0-70fc-464e-b01d-cd9cc89d919c.jpeg',
      blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
    },
  },
} as ComponentMeta<typeof GoodsCardMini>;

const Template: ComponentStory<typeof GoodsCardMini> = ({ ...args }) => <GoodsCardMini {...args} />;

export const 기본 = Template.bind({});
기본.args = {};

export const 긴_상품명 = Template.bind({});
긴_상품명.args = {
  goodsName: ' Holiday Signature boll',
};

export const 상품정보_숨김 = Template.bind({});
상품정보_숨김.args = {
  hideInfo: true,
};
