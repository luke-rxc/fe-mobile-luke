import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { GoodsCard } from './GoodsCard';

export default {
  title: `${StoriesMenu.PDS.DataDisplayCardType}/Goods/GoodsCard`,
  component: GoodsCard,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7273%3A30946',
    },
  },
} as ComponentMeta<typeof GoodsCard>;

const Template: ComponentStory<typeof GoodsCard> = ({ ...args }) => {
  return (
    <>
      <span style={{ display: 'inline-block', width: 136, marginRight: '15px' }}>
        <GoodsCard {...args} />
      </span>
      <span style={{ display: 'inline-block', width: 192, marginRight: '15px' }}>
        <GoodsCard {...args} />
      </span>
      <span style={{ display: 'inline-block', width: 216 }}>
        <GoodsCard {...args} />
      </span>
    </>
  );
};

const goodsInfo = {
  goodsId: 123,
  goodsCode: 'jj5yidd',
  image: {
    src: 'https://cdn-image.prizm.co.kr/goods/20220721/4f22d2a2-f860-46fe-8d4b-311e492674ba.jpeg?im=Resize,width=192',
    lazy: true,
    blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
  },
  goodsName: '[단독]_루미르4E 테이블 램프 카멜오렌지루미르4E 테이블 램프 카멜오렌지루미르4E 테이블 램프 카멜오렌지',
  price: 3000,
  discountRate: 0,
  brandImageUrl: 'https://cdn-image.prizm.co.kr/brand/20220713/b91857b5-28c0-4cf4-ab09-5db031138c6a.svg',
};

export const Default = Template.bind({});
Default.args = {
  ...goodsInfo,
};

export const 할인율_표시 = Template.bind({});
할인율_표시.args = {
  ...goodsInfo,
  discountRate: 50,
};

export const 브랜드로고_X_브랜드명_O = Template.bind({});
브랜드로고_X_브랜드명_O.args = {
  ...goodsInfo,
  brandImageUrl: '',
  brandName: 'Bottega Veneta Bottega Veneta',
};

export const 브랜드로고_상품라벨 = Template.bind({});
브랜드로고_상품라벨.args = {
  ...goodsInfo,
  label: '판매 예정',
};

export const 브랜드명_상품라벨 = Template.bind({});
브랜드명_상품라벨.args = {
  ...goodsInfo,
  brandImageUrl: '',
  brandName: 'Bottega Veneta',
  label: '판매 예정',
};

export const 브랜드로고_브랜드네임_라벨_X = Template.bind({});
브랜드로고_브랜드네임_라벨_X.args = {
  ...goodsInfo,
  brandImageUrl: '',
  brandName: '',
};

export const 브랜드로고_브랜드네임_X_라벨_O = Template.bind({});
브랜드로고_브랜드네임_X_라벨_O.args = {
  ...goodsInfo,
  brandImageUrl: '',
  brandName: '',
  label: '판매 예정',
};

export const 프리즘_온리상품 = Template.bind({});
프리즘_온리상품.args = {
  ...goodsInfo,
  tagType: 'prizmOnly',
};

export const 라이브_온리상품 = Template.bind({});
라이브_온리상품.args = {
  ...goodsInfo,
  tagType: 'liveOnly',
};

export const 로고_SVG_렌더 = Template.bind({});
로고_SVG_렌더.args = {
  ...goodsInfo,
  enableBrandSvg: true,
};

export const WishOn = Template.bind({});
WishOn.args = {
  wish: {
    showRoomId: 0,
    wished: true,
    wishedMotion: false,
  },
  ...goodsInfo,
};

export const WishOff = Template.bind({});
WishOff.args = {
  wish: {
    showRoomId: 0,
    wished: false,
    wishedMotion: false,
  },
  ...goodsInfo,
};

export const 상품혜택_라벨표시 = Template.bind({});
상품혜택_라벨표시.args = {
  ...goodsInfo,
  benefitLabel: '단독구성',
};

export const 상품혜택_라벨표시_쿠폰포함 = Template.bind({});
상품혜택_라벨표시_쿠폰포함.args = {
  ...goodsInfo,
  benefitLabel: '단독구성',
  hasCoupon: true,
};
