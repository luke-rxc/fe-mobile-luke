import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { CouponFormFields } from '../../types';
import { CheckoutMileage } from './CheckoutMileage';

export default {
  title: 'Features/Order/CheckoutMileage',
  component: CheckoutMileage,
} as ComponentMeta<typeof CheckoutMileage>;

const Template: ComponentStory<typeof CheckoutMileage> = (args) => {
  const method = useForm<CouponFormFields>({
    defaultValues: {
      usedPoint: 0,
      selectedCouponList: [],
      orderPrice: 0,
    },
    mode: 'onChange',
  });
  return (
    <FormProvider {...method}>
      <CheckoutMileage {...args} />
    </FormProvider>
  );
};
export const Basic = Template.bind({});
Basic.args = {
  usablePoint: 340,
  orderPrice: 0,
};
