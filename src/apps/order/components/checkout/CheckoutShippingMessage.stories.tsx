import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormFields } from '../../models';
import { CheckoutShippingMessage } from './CheckoutShippingMessage';
import { SHIPPING_MESSAGE_LIST } from '../../constants';

export default {
  title: 'Features/Order/CheckoutShippingMessage',
  component: CheckoutShippingMessage,
} as ComponentMeta<typeof CheckoutShippingMessage>;

const Template: ComponentStory<typeof CheckoutShippingMessage> = () => {
  const method = useForm<FormFields>({
    defaultValues: {
      message: '배송전 문자 주세요',
    },
  });

  return (
    <FormProvider {...method}>
      <CheckoutShippingMessage
        placeholder="배송 요청사항 선택"
        optionList={SHIPPING_MESSAGE_LIST}
        onChange={() => {}}
      />
    </FormProvider>
  );
};
export const Basic = Template.bind({});
