import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { PGType } from '@constants/order';
import { useCallback, useState } from 'react';
import { PaymentListGroup } from './PaymentListGroup';

export default {
  title: `${StoriesMenu.PDS.DataDisplayCardType}/Payment/PaymentListGroup`,
  component: PaymentListGroup,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=29920-112805&mode=design&t=yq6WrlzHyfSJwCTB-4',
    },
  },
} as ComponentMeta<typeof PaymentListGroup>;

const Template: ComponentStory<typeof PaymentListGroup> = ({ ...args }) => {
  const handleSelectedPay = useCallback((groupId: number, itemIndex: number) => {
    console.log(`선택한 item ${groupId} ${itemIndex}`);
  }, []);
  return <PaymentListGroup {...args} onSelect={handleSelectedPay} />;
};

const list = [
  {
    pgType: PGType.CREDIT_CARD,
    title: '신용카드신용카드신용카드신용카드신용카드신용카드신용카드신용카드',
    label: '혜택혜택혜택',
    description: (
      <>
        생애 첫 결제 시 2% 할인생애 첫 결제 시 2% 할인생애 첫 결제 시 2% 할인 생애 첫 결제 시 2% 할인생애 첫 결제 시 2%
        할인생애 첫 결제 시 2% 할인
      </>
    ),
  },
  {
    pgType: PGType.KAKAO_PAY,
    title: '카카오페이카카오페이카카오페이카카오페이카카오페이카카오페이',
    description: <>생애 첫 결제 시 2%</>,
  },
  {
    pgType: PGType.NAVER_PAY,
    title: '네이버페이네이버페이네이버페이네이버페이네이버페이네이버페이네이버페이네이버페이',
  },
  {
    pgType: PGType.TOSS_PAY,
    title: '토스페이토스페이토스페이토스페이토스페이토스페이',
    label: '혜택',
    description: (
      <>
        생애 첫 결제 시 2% 할인생애 첫 결제 시 2% 할인생애 첫 결제 시 2% 할인 생애 첫 결제 시 2% 할인생애 첫 결제 시 2%
        할인생애 첫 결제 시 2% 할인
      </>
    ),
  },
];

const list2 = [
  {
    pgType: PGType.PRIZM_PAY,
    title: '프리즘페이',
    label: '혜택',
    description: (
      <>
        생애 첫 결제 시 2% 할인생애 첫 결제 시 2% 할인생애 첫 결제 시 2% 할인 생애 첫 결제 시 2% 할인생애 첫 결제 시 2%
        할인생애 첫 결제 시 2% 할인
      </>
    ),
  },
  {
    pgType: PGType.TOSS_PAY,
    title: '토스페이토스페이토스페이토스페이토스페이토스페이',
    label: '혜택',
    description: (
      <>
        생애 첫 결제 시 2% 할인생애 첫 결제 시 2% 할인생애 첫 결제 시 2% 할인 생애 첫 결제 시 2% 할인생애 첫 결제 시 2%
        할인생애 첫 결제 시 2% 할인
      </>
    ),
  },
];

export const 결제수단그룹_리스트 = Template.bind({});
결제수단그룹_리스트.args = {
  list,
  selected: false,
};

const Template2: ComponentStory<typeof PaymentListGroup> = ({ ...args }) => {
  const handleSelectedPay = useCallback((groupId: number, itemIndex: number) => {
    console.log(`선택한 item ${groupId} ${itemIndex}`);
  }, []);
  return <PaymentListGroup {...args} groupId={0} onSelect={handleSelectedPay} />;
};
export const 결제수단그룹_단일 = Template2.bind({});
결제수단그룹_단일.args = {
  list: [{ ...list[0] }],
  selected: true,
};
export const 결제수단그룹_단일_초기비활성 = Template2.bind({});
결제수단그룹_단일_초기비활성.args = {
  list: [{ ...list[0] }],
  selected: true,
  selectedItemIndex: -1,
};

const Template3: ComponentStory<typeof PaymentListGroup> = ({ ...args }) => {
  const [isSeletedPrizmPay, setIsSeletedPrizmPay] = useState(false);

  const handleSelectedPay = useCallback((groupId: number, itemIndex: number) => {
    console.log(`선택한 item ${groupId} ${itemIndex}`);
    setIsSeletedPrizmPay(groupId === 1);
  }, []);
  return (
    <div>
      <PaymentListGroup {...args} list={list} groupId={0} selected={!isSeletedPrizmPay} onSelect={handleSelectedPay} />
      <div style={{ marginTop: '1.2rem' }}>
        <PaymentListGroup
          {...args}
          list={list2}
          groupId={1}
          selected={isSeletedPrizmPay}
          onSelect={handleSelectedPay}
        />
      </div>
    </div>
  );
};

export const 결제수단_그룹리스트_그룹리스트 = Template3.bind({});
결제수단_그룹리스트_그룹리스트.args = {};

const Template4: ComponentStory<typeof PaymentListGroup> = ({ ...args }) => {
  const [isSeletedPrizmPay, setIsSeletedPrizmPay] = useState(false);

  const handleSelectedPay = useCallback((groupId: number, itemIndex: number) => {
    console.log(`선택한 item ${groupId} ${itemIndex}`);
    setIsSeletedPrizmPay(groupId === 1);
  }, []);
  return (
    <div>
      <PaymentListGroup {...args} list={list} groupId={0} selected={!isSeletedPrizmPay} onSelect={handleSelectedPay} />
      <div style={{ marginTop: '1.2rem' }}>
        <PaymentListGroup
          {...args}
          list={[
            {
              pgType: PGType.PRIZM_PAY,
              title: '프리즘페이',
              label: '혜택',
              description:
                '생애 첫 결제 시 최대 2% 할인 생애 첫 결제 시 최대 2% 할인 생애 첫 결제 시 최대 2% 할인생애 첫 결제 시 최대 2% 할인 생애 첫 결제 시 최대 2% 할인 생애 첫 결제 시 최대 2% 할인생애 첫 결제 시 최대 2% 할인 생애 첫 결제 시 최대 2% 할인 생애 첫 결제 시 최대 2% 할인',
            },
          ]}
          groupId={1}
          selected={isSeletedPrizmPay}
          onSelect={handleSelectedPay}
        />
      </div>
    </div>
  );
};
export const 결제수단_그룹리스트_그룹단일 = Template4.bind({});
결제수단_그룹리스트_그룹단일.args = {};
