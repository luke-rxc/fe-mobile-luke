import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormFields } from '../../models';
import { CheckoutPCC } from './CheckoutPCC';

export default {
  title: 'Features/Order/CheckoutPCC',
  component: CheckoutPCC,
} as ComponentMeta<typeof CheckoutPCC>;

const Template: ComponentStory<typeof CheckoutPCC> = () => {
  const method = useForm<FormFields>({
    defaultValues: {
      pcc: '',
      isRequiredPcc: false,
    },
  });

  return (
    <FormProvider {...method}>
      <CheckoutPCC />
    </FormProvider>
  );
};
export const Basic = Template.bind({});
Basic.args = {};
