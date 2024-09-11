import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LiveGoodsList } from './LiveGoodsList';

export default {
  title: 'Features/Live/LiveGoodsList',
  component: LiveGoodsList,
} as ComponentMeta<typeof LiveGoodsList>;

const Template: ComponentStory<typeof LiveGoodsList> = (args) => {
  return <LiveGoodsList {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  items: [
    {
      goods: {
        isRunout: false,
        code: '43y1c',
        consumerPrice: 100000,
        consumerPriceText: '100000',
        discountRate: 10,
        discountRateText: '10',
        id: 139,
        name: '21ss 나이키 가방',
        price: 90000,
        priceText: '90000',
        primaryImage: {
          blurHash: 'UyCa*_i]I9WXyZjDjDayW@oet7V@Sja|tRax',
          height: 20,
          id: 104,
          path: 'https://cdn-dev.prizm.co.kr/goods/20210701/67a31399-e6aa-4353-8ab8-cf155d6ea343',
          width: 10,
        },
        showRoomId: 46,
        hasCoupon: true,
        benefits: {
          label: '',
          tagType: 'prizmOnly',
          isLiveOnly: false,
          isPrizmOnly: true,
        },
        status: 'NORMAL',
        type: 'NORMAL',
      },
      brand: {
        id: 2,
        name: 'nike',
      },
    },
  ],
};
