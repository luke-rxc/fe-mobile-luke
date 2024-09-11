import { StoriesMenu } from '@stories/menu';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '@pui/button';
import { Option } from '@pui/icon';
import { AddressListItem } from './AddressListItem';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Address/AddressListItem`,
  component: AddressListItem,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=29920-112478&mode=design&t=yq6WrlzHyfSJwCTB-4',
    },
  },
} as ComponentMeta<typeof AddressListItem>;

const Template: ComponentStory<typeof AddressListItem> = ({ ...args }) => <AddressListItem {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  id: 1,
  defaultAddress: true,
  name: '김나나',
  phone: '01033445566',
  postCode: '06159',
  address: '서울특별시 강남구 삼성동 143-40',
  addressDetail: '지하 1층 RXC',
  suffix: (
    <Button>
      <Option color="text.textTertiary" />
    </Button>
  ),
};

export const 선택 = Template.bind({});
선택.args = {
  id: 1,
  defaultAddress: true,
  name: '김나나',
  phone: '01033445566',
  postCode: '06159',
  address: '서울특별시 강남구 삼성동 143-40',
  addressDetail: '지하 1층 RXC',
  suffix: (
    <Button>
      <Option color="text.textTertiary" />
    </Button>
  ),
  selectable: true,
  checked: true,
};

export const 긴_텍스트 = Template.bind({});
긴_텍스트.args = {
  id: 1,
  defaultAddress: true,
  name: '김나나',
  phone: '01033445566',
  postCode: '06159',
  address: '서울특별시 강남구 삼성동 143-40',
  addressDetail:
    '지하 1층 RXC 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트 긴 텍스트',
  suffix: (
    <Button>
      <Option color="text.textTertiary" />
    </Button>
  ),
  selectable: true,
};
