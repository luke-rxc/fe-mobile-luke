import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { BidCheckoutBuyButton } from './BidCheckoutBuyButton';
import { FormFields, toBidCheckoutModel } from '../../models';
import { bidCheckout } from '../../apis/__mocks__/bidOrder';

export default {
  title: 'Features/Order/BidCheckoutBuyButton',
  component: BidCheckoutBuyButton,
} as ComponentMeta<typeof BidCheckoutBuyButton>;

const Template: ComponentStory<typeof BidCheckoutBuyButton> = (args) => {
  const method = useForm<FormFields>({
    defaultValues: {
      isRequiredPcc: false,
    },
  });

  const item = toBidCheckoutModel(bidCheckout);

  return (
    <FormProvider {...method}>
      <BidCheckoutBuyButton {...args} checkoutInfo={item} />
    </FormProvider>
  );
};
export const Basic = Template.bind({});
Basic.args = {};
