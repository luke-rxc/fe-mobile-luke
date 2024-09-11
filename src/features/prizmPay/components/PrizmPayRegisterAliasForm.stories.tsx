import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { CardFormFields } from '../models';
import { PrizmPayRegisterAliasForm } from './PrizmPayRegisterAliasForm';

export default {
  title: 'Features/MyPage/PrizmPayRegisterAliasForm',
  component: PrizmPayRegisterAliasForm,
} as ComponentMeta<typeof PrizmPayRegisterAliasForm>;

const Template: ComponentStory<typeof PrizmPayRegisterAliasForm> = (args) => {
  const method = useForm<CardFormFields>();

  return (
    <FormProvider {...method}>
      <PrizmPayRegisterAliasForm {...args} />
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
