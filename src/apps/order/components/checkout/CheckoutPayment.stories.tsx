import { PGType } from '@constants/order';
import { getUserPrizmPay, interestFreeCard as interestFreeCardApi } from '@features/prizmPay/apis/__mocks__';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormFields, PaymentType, toCheckoutPrizmPayModel } from '../../models';
import { CheckoutPayment } from './CheckoutPayment';

export default {
  title: 'Features/Order/CheckoutPayment',
  component: CheckoutPayment,
} as ComponentMeta<typeof CheckoutPayment>;

const Template: ComponentStory<typeof CheckoutPayment> = () => {
  const method = useForm<FormFields>({
    defaultValues: {
      payType: 'PG_PAY',
      prizmPayId: null,
    },
  });
  const res = getUserPrizmPay.content;
  const payList = res
    .map((card) => {
      const interestFreeCard = interestFreeCardApi.find((interest) => interest.cardCode === card.cardCode);
      return toCheckoutPrizmPayModel(card, interestFreeCard);
    })
    .map((card) => {
      return { ...card, logoPath: `https://cdn-dev.prizm.co.kr${card.logoPath}` };
    });
  const paymentTypeList: PaymentType[] = [
    {
      pgType: PGType.CREDIT_CARD,
      title: '신용카드',
      benefitList: [
        {
          title: '',
          content: '100만원 이상 결제시 1% 적립금 지급',
        },
      ],
    },
    {
      pgType: PGType.KAKAO_PAY,
      title: '카카오',
      benefitList: [
        {
          title: '신한카드',
          content: '7만원 이상 결제시 5% 청구 할인',
        },
        {
          title: '현대카드',
          content: '3만원이상 2% 추가 할인!',
        },
      ],
    },
    {
      pgType: PGType.NAVER_PAY,
      title: '네이버',
    },
    {
      pgType: PGType.TOSS_PAY,
      title: '토스',
      benefitList: [],
    },
  ];

  return (
    <FormProvider {...method}>
      <CheckoutPayment
        selectedType={PGType.KAKAO_PAY}
        paymentTypeList={paymentTypeList}
        prizmPayList={payList}
        isShowInstallmentDropdown
        bannerList={[]}
        onEventBannerClick={() => {}}
      />
    </FormProvider>
  );
};
export const Basic = Template.bind({});
