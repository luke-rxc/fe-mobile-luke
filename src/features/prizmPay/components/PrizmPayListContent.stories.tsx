import { ComponentStory, ComponentMeta } from '@storybook/react';
import { toPrizmPayListModel } from '../models';
import { PrizmPayListContent } from './PrizmPayListContent';
import { getUserPrizmPay } from '../apis/__mocks__';

export default {
  title: 'Features/MyPage/PrizmPayListContent',
  component: PrizmPayListContent,
} as ComponentMeta<typeof PrizmPayListContent>;

const Template: ComponentStory<typeof PrizmPayListContent> = (args) => {
  const res = getUserPrizmPay.content;
  const model = toPrizmPayListModel(res);
  return (
    <PrizmPayListContent
      {...args}
      payList={model.map((pay) => {
        return {
          ...pay,
          logoPath: `https://cdn-dev.prizm.co.kr${pay.logoPath}`,
        };
      })}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  onAdd: () => {},
};
