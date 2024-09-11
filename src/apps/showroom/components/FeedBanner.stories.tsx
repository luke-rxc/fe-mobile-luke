import { StoriesMenu } from '@stories/menu';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FeedBanner } from './FeedBanner';

export default {
  title: `${StoriesMenu.Apps}/Showroom/components/FeedBanner`,
  component: FeedBanner,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?node-id=43557%3A170715&t=gHZj1D80NAVkuZfD-4',
    },
  },
} as ComponentMeta<typeof FeedBanner>;

const Template: ComponentStory<typeof FeedBanner> = ({ ...args }) => <FeedBanner {...args} />;

const feedBannerDefaultArgs = {
  title: 'Banner Title',
  subTitle: 'Banner SubTitle',
  bannerType: 'GOODS',
  landingCode: 'test',
  image: {
    src: 'https://cdn-image.prizm.co.kr/story/20220714/8cc2b96b-90b4-4399-b5c5-8ecb4f017875.jpeg',
    blurHash: 'L58W~t?HMxsC00j]t7og?wI:o#S4',
  },
  goods: new Array(8).fill({}).map((_, index) => ({
    goodsId: `${index}`,
    goodsCode: 'goodsCode',
    goodsName: 'Holiday Signature boll',
    price: 10000,
    discountRate: 5,
    image: {
      src: '/showroom/20220727/9a5a61d0-70fc-464e-b01d-cd9cc89d919c.jpeg',
      blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
    },
  })),
};

export const 상품_1개 = Template.bind({});
상품_1개.args = {
  ...feedBannerDefaultArgs,
  goods: [
    {
      goodsId: 99999,
      goodsCode: 'goodsCode',
      goodsName: 'Holiday Signature boll',
      price: 10000,
      discountRate: 5,
      image: {
        src: '/showroom/20220727/9a5a61d0-70fc-464e-b01d-cd9cc89d919c.jpeg',
        blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
      },
    },
  ],
};
상품_1개.decorators = [
  (Story) => (
    <div style={{ width: '327px' }}>
      <Story />
    </div>
  ),
];

export const 상품_2개_이상 = Template.bind({});
상품_2개_이상.args = {
  ...feedBannerDefaultArgs,
};
상품_2개_이상.decorators = [
  (Story) => (
    <div style={{ width: '327px' }}>
      <Story />
    </div>
  ),
];

export const 배너_너비_가변 = Template.bind({});
배너_너비_가변.args = {
  ...feedBannerDefaultArgs,
};
