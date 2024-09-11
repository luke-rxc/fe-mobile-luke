import { AuthenticationFormFields } from '@features/authentication/types';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { checkout } from '../../apis/__mocks__';
import { toCheckoutOrdererInfoModel } from '../../models';
import { CheckoutAuth } from './CheckoutAuth';

export default {
  title: 'Features/Order/CheckoutAuth',
  component: CheckoutAuth,
} as ComponentMeta<typeof CheckoutAuth>;

const orderer = toCheckoutOrdererInfoModel(checkout.orderer);

const Template: ComponentStory<typeof CheckoutAuth> = (args) => {
  const method = useForm<AuthenticationFormFields>({
    defaultValues: {
      name: '',
      phone: '',
      authenticationNumber: '',
    },
  });
  return (
    <FormProvider {...method}>
      <CheckoutAuth {...args} />
    </FormProvider>
  );
};
export const 본인인증_인증 = Template.bind({});
본인인증_인증.args = {
  orderer,
};

export const 본인인증_미인증 = Template.bind({});
본인인증_미인증.args = {
  orderer: {
    ...orderer,
    isIdentify: false,
  },
};
