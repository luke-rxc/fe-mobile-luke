import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { getUserPrizmPay } from '@features/prizmPay/apis/__mocks__';
import { CheckoutPrizmPayCarousel } from './CheckoutPrizmPayCarousel';
import { FormFields, toCheckoutPrizmPayModel } from '../../models';

export default {
  title: 'Features/Order/CheckoutPrizmPayCarousel',
  component: CheckoutPrizmPayCarousel,
} as ComponentMeta<typeof CheckoutPrizmPayCarousel>;

const Template: ComponentStory<typeof CheckoutPrizmPayCarousel> = (args) => {
  const method = useForm<FormFields>({
    defaultValues: {
      prizmPayId: null,
    },
  });

  const payList = getUserPrizmPay.content.map((card) => {
    return toCheckoutPrizmPayModel(card);
  });

  return (
    <FormProvider {...method}>
      <CarouselStyled {...args} items={payList} />
    </FormProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};

const CarouselStyled = styled(CheckoutPrizmPayCarousel)`
  padding: 0;

  .swiper-container {
    padding: 0;
  }
`;
