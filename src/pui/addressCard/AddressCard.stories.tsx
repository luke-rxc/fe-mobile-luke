import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { AddressCard } from './AddressCard';

export default {
  title: `${StoriesMenu.PDS.DataDisplayCardType}/Address/AddressCard`,
  component: AddressCard,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=29920-137862&mode=design&t=yq6WrlzHyfSJwCTB-4',
    },
  },
} as ComponentMeta<typeof AddressCard>;

const Template: ComponentStory<typeof AddressCard> = ({ ...args }) => <AddressCard {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  name: '김나나',
  phone: '01033445566',
  address: '서울 강남구 테헤란로 427 (삼성동,위워크타워)',
  addressDetail: '지하 1층',
};

export const 활성화 = Template.bind({});
활성화.args = {
  name: '김나나',
  phone: '01033445566',
  address: '서울 강남구 테헤란로 427 (삼성동,위워크타워)',
  addressDetail: '지하 1층',
  active: true,
};

export const 긴_문자열 = Template.bind({});
긴_문자열.args = {
  name: '김나나',
  phone: '01033445566',
  address: '서울 강남구 테헤란로 427 (삼성동,위워크타워)',
  addressDetail: '지하 1층 긴 문자열 긴 문자열 긴 문자열 긴 문자열 긴 문자열',
};
