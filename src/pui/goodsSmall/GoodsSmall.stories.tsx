import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { GoodsSmall, GoodsSmallComponent } from './GoodsSmall';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Goods/GoodsSmall`,
  component: GoodsSmall,
  parameters: {
    design: [
      {
        name: 'figma - PDS',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=25310-58431&t=cbYSTKV4DFHnR9tn-4',
      },
    ],
  },
} as ComponentMeta<typeof GoodsSmallComponent>;

const Template: ComponentStory<typeof GoodsSmallComponent> = ({ ...args }) => <GoodsSmall {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  goodsName: '상품명',
  brandName: '브랜드',
  options: ['가나다라마나아바', '가나다라마나아바', '가나다라마나아바'],
  image: {
    src: 'https://cdn-image.prizm.co.kr/goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
    blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
  },
};

export const 옵션이_긴_경우 = Template.bind({});
옵션이_긴_경우.args = {
  goodsName: '상품명',
  brandName: '브랜드',
  options: new Array(50).fill('가나다라마나아바'),
  image: {
    src: 'https://cdn-image.prizm.co.kr/goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
    blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
  },
};

export const 랜딩이_있는_경우 = Template.bind({});
랜딩이_있는_경우.args = {
  goodsName: '상품명',
  goodsCode: 'knjy0',
  brandName: '브랜드',
  options: new Array(50).fill('가나다라마나아바'),
  image: {
    src: 'https://cdn-image.prizm.co.kr/goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
    blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
  },
};
