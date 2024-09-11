import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { ChatFormField } from '../types';
import { UserChatInput } from './UserChatInput';

export default {
  title: 'Features/Live/UserChatInput',
  component: UserChatInput,
} as ComponentMeta<typeof UserChatInput>;

const Template: ComponentStory<typeof UserChatInput> = (args) => {
  const formMethod = useForm<ChatFormField>({
    defaultValues: {
      message: '',
    },
  });

  return (
    <FormProvider {...formMethod}>
      <UserChatInput {...args} />
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};
