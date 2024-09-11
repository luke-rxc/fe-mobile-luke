import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { checkout } from '../../apis/__mocks__';
import { FormFields, toCheckoutSummaryModel } from '../../models';
import { CheckoutSummary } from './CheckoutSummary';

export default {
  title: 'Features/Order/CheckoutSummary',
  component: CheckoutSummary,
} as ComponentMeta<typeof CheckoutSummary>;

const Template: ComponentStory<typeof CheckoutSummary> = (args) => {
  const method = useForm<FormFields>();
  const item = toCheckoutSummaryModel(checkout.payment);
  return (
    <FormProvider {...method}>
      <CheckoutSummary {...args} summaryInfo={item} />
    </FormProvider>
  );
};
export const Basic = Template.bind({});
Basic.args = {};
