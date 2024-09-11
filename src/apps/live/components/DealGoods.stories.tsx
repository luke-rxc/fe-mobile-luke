import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DealGoods } from './DealGoods';

export default {
  title: 'Features/Live/DealGoods',
  component: DealGoods,
} as ComponentMeta<typeof DealGoods>;

const Template: ComponentStory<typeof DealGoods> = (args) => {
  return (
    <div style={{ border: '1px solid #eee', backgroundColor: '#eee' }}>
      <DealGoods {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  item: {
    isRunOut: false,
    images: [
      {
        blurHash: 'UyCa*_i]I9WXyZjDjDayW@oet7V@Sja|tRax',
        height: 20,
        id: 104,
        path: 'https://cdn-dev.prizm.co.kr/goods/20210701/67a31399-e6aa-4353-8ab8-cf155d6ea343',
        width: 10,
      },
      {
        blurHash: 'UyCa*_i]I9WXyZjDjDayW@oet7V@Sja|tRax',
        height: 20,
        id: 104,
        path: 'https://cdn-dev.prizm.co.kr/goods/20210701/67a31399-e6aa-4353-8ab8-cf155d6ea343',
        width: 10,
      },
      {
        blurHash: 'UyCa*_i]I9WXyZjDjDayW@oet7V@Sja|tRax',
        height: 20,
        id: 104,
        path: 'https://cdn-dev.prizm.co.kr/goods/20210701/67a31399-e6aa-4353-8ab8-cf155d6ea343',
        width: 10,
      },
      {
        blurHash: 'UyCa*_i]I9WXyZjDjDayW@oet7V@Sja|tRax',
        height: 20,
        id: 104,
        path: 'https://cdn-dev.prizm.co.kr/goods/20210701/67a31399-e6aa-4353-8ab8-cf155d6ea343',
        width: 10,
      },
      {
        blurHash: 'UyCa*_i]I9WXyZjDjDayW@oet7V@Sja|tRax',
        height: 20,
        id: 104,
        path: 'https://cdn-dev.prizm.co.kr/goods/20210701/67a31399-e6aa-4353-8ab8-cf155d6ea343',
        width: 10,
      },
    ],
    priceText: '1000',
    id: 1,
    goodsName: '설화수',
    hasCoupon: false,
    benefits: {
      label: null,
      tagType: 'none',
      isPrizmOnly: false,
      isLiveOnly: false,
    },
  },
};
