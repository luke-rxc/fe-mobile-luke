import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { CreditCard } from './CreditCard';

export default {
  title: `${StoriesMenu.PDS.DataDisplayCardType}/Credit/CreditCard`,
  component: CreditCard,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=29920-137703&mode=design&t=yq6WrlzHyfSJwCTB-4',
    },
  },
} as ComponentMeta<typeof CreditCard>;

const Template: ComponentStory<typeof CreditCard> = ({ ...args }) => (
  <ContainerStyled>
    <CreditCard {...args} />
  </ContainerStyled>
);

export const 기본 = Template.bind({});
기본.args = {
  no: '2911********1245',
  name: '생활비카드',
  company: '',
  logoUrl: 'https://cdn-dev.prizm.co.kr/service/img_pay_default.svg',
  color: '#000000',
  badgeLabel: '주카드',
  cardLabel: '',
};

export const 카드_만료 = Template.bind({});
카드_만료.args = {
  no: '2911********1245',
  name: '생활비카드',
  company: '',
  logoUrl: 'https://cdn-dev.prizm.co.kr/service/img_pay_default.svg',
  color: '#000000',
  badgeLabel: '재등록 필요',
  disabled: true,
  cardLabel: 'CHECK',
};

const ContainerStyled = styled.div`
  width: 24rem;
`;
