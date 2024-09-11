import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { checkout } from '../../apis/__mocks__';
import { FormFields, toCheckoutRecipientInfoModel } from '../../models';
import { CheckoutShipping } from './CheckoutShipping';

export default {
  title: 'Features/Order/CheckoutShipping',
  component: CheckoutShipping,
} as ComponentMeta<typeof CheckoutShipping>;

const Template: ComponentStory<typeof CheckoutShipping> = (args) => {
  const method = useForm<FormFields>();
  const item = toCheckoutRecipientInfoModel(checkout.recipient);
  return (
    <FormProvider {...method}>
      <CheckoutShipping {...args} recipientInfo={item} />
    </FormProvider>
  );
};
export const Basic = Template.bind({});
Basic.args = {};
