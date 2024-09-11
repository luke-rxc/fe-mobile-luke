import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { BidCheckoutContent } from './BidCheckoutContent';
import { FormFields, toBidCheckoutModel } from '../../models';
import { bidCheckout } from '../../apis/__mocks__/bidOrder';

export default {
  title: 'Features/Order/BidCheckoutContent',
  component: BidCheckoutContent,
} as ComponentMeta<typeof BidCheckoutContent>;

const Template: ComponentStory<typeof BidCheckoutContent> = (args) => {
  const method = useForm<FormFields>({
    defaultValues: {
      isRequiredPcc: false,
    },
  });
  const item = toBidCheckoutModel(bidCheckout);
  return (
    <FormProvider {...method}>
      <BidCheckoutContent {...args} item={item} />
    </FormProvider>
  );
};
export const Basic = Template.bind({});
Basic.args = {};
