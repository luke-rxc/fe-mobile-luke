import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { CardFormFields, CARD_FIELDS } from '../models';
import { PrizmPayRegisterCardInfoForm } from './PrizmPayRegisterCardInfoForm';

export default {
  title: 'Features/MyPage/PrizmPayRegisterCardInfoForm',
  component: PrizmPayRegisterCardInfoForm,
} as ComponentMeta<typeof PrizmPayRegisterCardInfoForm>;

const Template: ComponentStory<typeof PrizmPayRegisterCardInfoForm> = (args) => {
  const method = useForm<CardFormFields>({
    defaultValues: CARD_FIELDS,
  });

  return (
    <FormProvider {...method}>
      <PrizmPayRegisterCardInfoForm {...args} />
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
