import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { GoodsListItem } from './GoodsListItem';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Goods/GoodsListItem`,
  component: GoodsListItem,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=228%3A378',
    },
  },
} as ComponentMeta<typeof GoodsListItem>;

const Template: ComponentStory<typeof GoodsListItem> = ({ ...args }) => (
  <div style={{ border: '1px solid #eee' }}>
    <GoodsListItem {...args} />
  </div>
);

const goodsInfo = {
  goodsCode: 'jj5yidd',
  image: {
    src: 'https://cdn-image.prizm.co.kr/goods/20220721/4f22d2a2-f860-46fe-8d4b-311e492674ba.jpeg?im=Resize,width=192',
    lazy: true,
    blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
  },
  goodsName: '[단독] 루미르4E 테이블 램프 카멜오렌지',
  price: 3000,
  discountRate: 0,
  brandName: '두잇디자인연구소',
};

export const Default = Template.bind({});
Default.args = {
  ...goodsInfo,
};

export const 할인율 = Template.bind({});
할인율.args = {
  ...goodsInfo,
  discountRate: 30,
};

export const 상품혜택_라벨표시 = Template.bind({});
상품혜택_라벨표시.args = {
  ...goodsInfo,
  discountRate: 30,
  benefitLabel: '단독구성',
};

export const 상품혜택_라벨표시_쿠폰포함 = Template.bind({});
상품혜택_라벨표시_쿠폰포함.args = {
  ...goodsInfo,
  discountRate: 30,
  benefitLabel: '단독구성',
  hasCoupon: true,
};

export const 상품혜택_프리즘온리 = Template.bind({});
상품혜택_프리즘온리.args = {
  ...goodsInfo,
  discountRate: 30,
  benefitLabel: '단독구성',
  hasCoupon: true,
  tagType: 'prizmOnly',
};

export const 상품혜택_라이브온리 = Template.bind({});
상품혜택_라이브온리.args = {
  ...goodsInfo,
  discountRate: 30,
  benefitLabel: '단독구성',
  hasCoupon: true,
  tagType: 'liveOnly',
};
