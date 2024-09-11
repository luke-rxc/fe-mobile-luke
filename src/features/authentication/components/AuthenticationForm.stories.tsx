import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { AuthenticationFormFields } from '../types';
import { AuthenticationForm } from './AuthenticationForm';

export default {
  title: 'Components/AuthenticationForm',
  component: AuthenticationForm,
} as ComponentMeta<typeof AuthenticationForm>;

const Template: ComponentStory<typeof AuthenticationForm> = (args) => {
  const method = useForm<AuthenticationFormFields>({
    defaultValues: {
      phone: '',
      name: '',
    },
  });

  return (
    <FormProvider {...method}>
      <AuthenticationForm {...args} />
    </FormProvider>
  );
};
export const Default = Template.bind({});
Default.args = {
  isSend: false,
};
