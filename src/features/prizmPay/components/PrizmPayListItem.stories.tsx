import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '@pui/button';
import { Option } from '@pui/icon';
import { toPrizmPayListModel } from '../models';
import { PrizmPayListItem } from './PrizmPayListItem';
import { getUserPrizmPay } from '../apis/__mocks__';

export default {
  title: 'Features/PrizmPayListItem',
  component: PrizmPayListItem,
} as ComponentMeta<typeof PrizmPayListItem>;

const Template: ComponentStory<typeof PrizmPayListItem> = () => {
  const res = getUserPrizmPay.content;
  const model = toPrizmPayListModel(res)[0];

  const ActionComp = () => {
    return (
      <Button>
        <Option color="gray50" />
      </Button>
    );
  };

  return (
    <PrizmPayListItem
      logoUrl={`https://cdn-dev.prizm.co.kr${model.logoPath}`}
      name={model.cardAlias ?? model.cardName ?? ''}
      no={model.cardNumber}
      color={model.color}
      isDefault={model.isDefault}
      isExpired={model.isExpired}
      suffix={<ActionComp />}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
