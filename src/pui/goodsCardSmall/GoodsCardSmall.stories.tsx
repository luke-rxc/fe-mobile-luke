import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { GoodsCardSmall, GoodsCardSmallComponent } from './GoodsCardSmall';

export default {
  title: `${StoriesMenu.PDS.DataDisplayCardType}/Goods/GoodsCardSmall`,
  component: GoodsCardSmall,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=14032%3A46581',
    },
  },
  args: {
    goodsCode: 'kq5y0',
    brandName: '브랜드 이름',
    goodsName: '상품 이름',
    price: 10000,
    discountRate: 50,
    image: {
      src: 'showroom/20220727/9a5a61d0-70fc-464e-b01d-cd9cc89d919c.jpeg',
      blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
    },
  },
} as ComponentMeta<typeof GoodsCardSmallComponent>;

const Template: ComponentStory<typeof GoodsCardSmallComponent> = ({ ...args }) => <GoodsCardSmall {...args} />;

export const 기본 = Template.bind({});
기본.args = {};

export const 긴_브랜드명 = Template.bind({});
긴_브랜드명.args = {
  brandName:
    'Moment Ballcap_beige2Ballcap_beige2Moment Ballcap_beige2Ballcap_beige2Moment Ballcap_beige2Ballcap_beige2Moment Ballcap_beige2Ballcap_beige2Moment Ballcap_beige2Ballcap_beige2Moment Ballcap_beige2Ballcap_beige2',
};

export const 긴_상품명 = Template.bind({});
긴_상품명.args = {
  goodsName:
    'Moment Ballcap_beige2Ballcap_beige2Moment Ballcap_beige2Ballcap_beige2Moment Ballcap_beige2Ballcap_beige2Moment Ballcap_beige2Ballcap_beige2Moment Ballcap_beige2Ballcap_beige2Moment Ballcap_beige2Ballcap_beige2',
};

export const NO_할인율 = Template.bind({});
NO_할인율.args = {
  // discountRate는 optional
  discountRate: 0,
};

export const PRIZM_ONLY = Template.bind({});
PRIZM_ONLY.args = {
  tagType: 'prizmOnly',
};

export const LIVE_ONLY = Template.bind({});
LIVE_ONLY.args = {
  tagType: 'liveOnly',
};

export const 상품혜택_라벨표시 = Template.bind({});
상품혜택_라벨표시.args = {
  benefitLabel: '단독구성',
};

export const 상품혜택_라벨표시_쿠폰포함 = Template.bind({});
상품혜택_라벨표시_쿠폰포함.args = {
  benefitLabel: '단독구성',
  hasCoupon: true,
  prizmOnly: true,
};
