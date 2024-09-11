import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { DeliveryFormFields } from '../models';
import { DeliveryRegisterForm } from './DeliveryRegisterForm';

export default {
  title: 'Features/Delivery/DeliveryRegisterForm',
  component: DeliveryRegisterForm,
} as ComponentMeta<typeof DeliveryRegisterForm>;

const Template: ComponentStory<typeof DeliveryRegisterForm> = (args) => {
  const method = useForm<DeliveryFormFields>();
  const { setValue } = method;

  const handleAddressChange = (address: { code: string; addr: string }) => {
    setValue('postCode', address.code);
    setValue('address', address.addr);
  };

  return (
    <FormProvider {...method}>
      <DeliveryRegisterForm {...args} onAddressChange={handleAddressChange} />
    </FormProvider>
  );
};
export const Basic = Template.bind({});
Basic.args = {};
