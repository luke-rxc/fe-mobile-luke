import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { BrandListItemMedium } from './BrandListItemMedium';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Brand/BrandListItemMedium`,
  component: BrandListItemMedium,
  parameters: {
    design: [
      {
        name: 'figma - PDS',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=6004%3A22731',
      },
      {
        name: 'figma - pressed',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7126%3A30556',
      },
    ],
  },
  args: {
    title: 'Brand Title',
    description: 'description',
    followed: false,
    onAir: false,
    liveId: 123,
    showroomCode: 'test',
    imageURL: '/showroom/20220727/9a5a61d0-70fc-464e-b01d-cd9cc89d919c.jpeg',
    mainColorCode: '#ff00ff',
    disabledFollow: false,
  },
} as ComponentMeta<typeof BrandListItemMedium>;

const Template: ComponentStory<typeof BrandListItemMedium> = ({ ...args }) => <BrandListItemMedium {...args} />;

export const 기본 = Template.bind({});

export const 라이브 = Template.bind({});
라이브.args = {
  onAir: true,
  mainColorCode: '#2348c2',
};

export const 팔로잉 = Template.bind({});
팔로잉.args = {
  followed: true,
};

export const 팔로우버튼_비활성화 = Template.bind({});
팔로우버튼_비활성화.args = {
  disabledFollow: true,
};

export const 긴_문자열 = Template.bind({});
긴_문자열.args = {
  title: new Array(20).fill('Brand Title').join(' '),
  description: new Array(20).fill('description').join(' '),
};

export const 브랜드상품O = Template.bind({});
브랜드상품O.args = {
  goods: new Array(15).fill({
    goodsCode: 'goodsCode',
    goodsName: 'Holiday Signature boll',
    price: 10000,
    discountRate: 5,
    image: {
      src: '/showroom/20220727/9a5a61d0-70fc-464e-b01d-cd9cc89d919c.jpeg',
      blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
    },
  }),
};
