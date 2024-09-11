import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { CouponListItem } from './CouponListItem';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Coupon/(CouponListItem)`,
  component: CouponListItem,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7126%3A35264',
    },
  },
  argTypes: {
    expiryDate: { control: 'date' },
  },
  args: {
    title: '10,000원',
    name: '일이삼사오육칠팔구십일이삼사오육칠',
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 31)).getTime(),
    imageURL: undefined,
    blurHash: undefined,
    minPurchase: 10000,
    maxDiscount: 10000,
  },
} as ComponentMeta<typeof CouponListItem>;

const Template: ComponentStory<typeof CouponListItem> = ({ ...args }) => <CouponListItem {...args} />;

export const 기본 = Template.bind({});
기본.args = {};

export const 이미지_썸네일 = Template.bind({});
이미지_썸네일.args = {
  imageURL: 'https://cdn-image.prizm.co.kr/goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
  blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
};

export const 쿠폰명_여러줄 = Template.bind({});
쿠폰명_여러줄.args = {
  name: new Array(100).fill('최대 2줄').join(' '),
};

export const 만료까지_하루미만 = Template.bind({});
만료까지_하루미만.args = {
  expiryDate: new Date(new Date().setHours(new Date().getHours() + 1)).getTime(),
};

export const 만료까지_30일이하 = Template.bind({});
만료까지_30일이하.args = {
  expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).getTime(),
};

export const 만료까지_30일초과 = Template.bind({});
만료까지_30일초과.args = {};
