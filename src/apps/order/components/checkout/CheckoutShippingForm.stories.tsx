import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { CheckoutShippingFormFields } from '../../models';
import { CheckoutShippingForm } from './CheckoutShippingForm';

export default {
  title: 'Features/Order/CheckoutShippingForm',
  component: CheckoutShippingForm,
} as ComponentMeta<typeof CheckoutShippingForm>;

const Template: ComponentStory<typeof CheckoutShippingForm> = (args) => {
  const { register, setValue } = useForm<CheckoutShippingFormFields>();

  const handleAddressChange = (address: { code: string; addr: string }) => {
    setValue('postCode', address.code);
    setValue('address', address.addr);
  };

  return <CheckoutShippingForm {...args} register={register} onAddressChange={handleAddressChange} />;
};
export const Basic = Template.bind({});
Basic.args = {};
