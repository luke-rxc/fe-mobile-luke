import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Action } from '@pui/action';
import { Option } from '@pui/icon';
import { CreditCardListItem } from './CreditCardListItem';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Payment/CreditCardListItem`,
  component: CreditCardListItem,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=29920-112630&mode=design&t=yq6WrlzHyfSJwCTB-4',
    },
  },
} as ComponentMeta<typeof CreditCardListItem>;

const Template: ComponentStory<typeof CreditCardListItem> = ({ ...args }) => <CreditCardListItem {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  no: '2911********1245',
  name: '생활비카드',
  primary: true,
  logoUrl: 'https://cdn-dev.prizm.co.kr/service/img_pay_default.svg',
  color: '#000000',
  expired: false,
};

export const 커스터마이징 = Template.bind({});
커스터마이징.args = {
  no: '2911********1245',
  name: '생활비카드',
  primary: true,
  logoUrl: 'https://cdn-dev.prizm.co.kr/service/img_pay_default.svg',
  color: '#000000',
  expired: false,
  suffix: (
    <Action>
      <Option color="gray50" />
    </Action>
  ),
};

export const 카드_만료 = Template.bind({});
카드_만료.args = {
  no: '2911********1245',
  name: '생활비카드',
  primary: false,
  logoUrl: 'https://cdn-dev.prizm.co.kr/service/img_pay_default.svg',
  color: '#000000',
  expired: true,
};
