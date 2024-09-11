import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { toDateFormat } from '@utils/date';
import { OrderGoods } from './OrderGoods';

const createExpiryDate = (addDays: number) => {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();
  const expiryDate = today.getTime() + (addDays || 0) * 24 * 60 * 60 * 1000;
  let expiryDateText = toDateFormat(expiryDate, `yyyy. M, d (${daysOfWeek[new Date(expiryDate).getUTCDay() || 0]})`);

  if (addDays < 31) {
    expiryDateText = `D-${addDays}`;
  }

  return {
    expiryDateText,
    expiryDate,
  };
};

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/OrderGoods`,
  component: OrderGoods,
  args: {
    brandName: '조선 팰리스',
    goodsName: 'Grand Masters Suite',
    goodsImage: {
      src: 'https://cdn-dev.prizm.co.kr/goods/20210701/f1678b66-a710-4c03-829d-572e1ddf274a',
    },
    orderStatus: '결재완료',
    price: 240000,
    options: ['특별 스파 서비스(2인)'],
    quantity: 1,
  },
} as ComponentMeta<typeof OrderGoods>;

const Template: ComponentStory<typeof OrderGoods> = (args) => <OrderGoods {...args} />;

export const 일반상품 = Template.bind({});
일반상품.args = {
  brandName: 'TOUN28',
  goodsName: '톤28 바른 바를거리',
  goodsOption: '50ml / 지성용  • 5개',
  status: 'COMPLETED',
  statusText: '배송완료',
};

export const 티켓상품 = Template.bind({});
티켓상품.args = {
  options: ['2023. 1. 1 (일)', '특별 스파 서비스(2인)'],
  ticketValidity: {
    ...createExpiryDate(31),
  },
};

export const 티켓상품_30일미만 = Template.bind({});
티켓상품_30일미만.args = {
  options: ['2023. 1. 1 (일)', '특별 스파 서비스(2인)'],
  ticketValidity: {
    ...createExpiryDate(30),
  },
};

export const 티켓상품_5일미만 = Template.bind({});
티켓상품_5일미만.args = {
  options: ['2023. 1. 1 (일)', '특별 스파 서비스(2인)'],
  ticketValidity: {
    ...createExpiryDate(4),
    soonExpire: true,
  },
};
