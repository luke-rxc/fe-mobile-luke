import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { BidCheckoutGoodsInfo } from './BidCheckoutGoodsInfo';
import { FormFields, toBidCheckoutGoodsInfoModel } from '../../models';
import { bidCheckout } from '../../apis/__mocks__/bidOrder';

export default {
  title: 'Features/Order/BidCheckoutGoodsInfo',
  component: BidCheckoutGoodsInfo,
} as ComponentMeta<typeof BidCheckoutGoodsInfo>;

const Template: ComponentStory<typeof BidCheckoutGoodsInfo> = (args) => {
  const method = useForm<FormFields>();
  const item = toBidCheckoutGoodsInfoModel(bidCheckout.itemList).goodsInfos;
  const goodsInfos = item.map((goodsInfo) => {
    return {
      ...goodsInfo,
      goodsList: goodsInfo.goodsList.map((goods) => {
        return {
          ...goods,
          primaryImage: {
            ...goods.primaryImage,
            path: `https://cdn-dev.prizm.co.kr${goods.primaryImage.path}`,
          },
        };
      }),
    };
  });

  return (
    <FormProvider {...method}>
      <BidCheckoutGoodsInfo {...args} item={{ ...item, goodsInfos }} />
    </FormProvider>
  );
};
export const Basic = Template.bind({});
Basic.args = {};
