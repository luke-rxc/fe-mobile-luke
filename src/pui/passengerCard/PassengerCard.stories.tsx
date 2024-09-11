import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { PassengerCard } from './PassengerCard';

export default {
  title: `${StoriesMenu.PDS.DataDisplayCardType}/Passenger/PassengerCard`,
  component: PassengerCard,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=33539-29370',
    },
  },
} as ComponentMeta<typeof PassengerCard>;

const Template: ComponentStory<typeof PassengerCard> = ({ ...args }) => <PassengerCard {...args} />;

export const 탑승자추가 = Template.bind({});
탑승자추가.args = {
  status: 'add',
};

export const 국내선기본 = Template.bind({});
국내선기본.args = {
  name: '홍길동',
  dob: '2000.12.30',
  sex: '남성',
  nationality: '대한민국',
};

export const 국내선유아동반 = Template.bind({});
국내선유아동반.args = {
  name: '홍길동',
  dob: '2000.12.30',
  sex: '남성',
  nationality: '대한민국',
  isInfantAccompanied: true,
};

export const 국제선기본 = Template.bind({});
국제선기본.args = {
  name: '홍길동',
  dob: '2000.12.30',
  sex: '남성',
  nationality: '대한민국',
  passportNumber: 'M12345678',
};

export const 국제선유아동반 = Template.bind({});
국제선유아동반.args = {
  name: '홍길동',
  dob: '2000.12.30',
  sex: '남성',
  nationality: '대한민국',
  passportNumber: 'M12345678',
  isInfantAccompanied: true,
};
