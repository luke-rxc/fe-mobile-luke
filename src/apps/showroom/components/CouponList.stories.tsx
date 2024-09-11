import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { v4 as uuid } from 'uuid';
import { CouponList } from './CouponList';
import reference from './ContentList.stories';

const createCoupon = () => ({
  id: uuid(),
  title: '10%',
  name: '상품',
});

export default {
  title: `${StoriesMenu.Apps}/Showroom/components/CouponList`,
  component: CouponList,
  parameters: {
    design: [
      {
        type: 'figma',
        name: '쿠폰 정책',
        url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?node-id=27424%3A163810&t=n5v0nCIZZs4ZVHgV-4',
      },
      {
        type: 'figma',
        name: '쿠폰 디자인 - 다운 가능',
        url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?node-id=16057%3A130008&t=n5v0nCIZZs4ZVHgV-4',
      },
      {
        type: 'figma',
        name: '쿠폰 디자인 - 다운 완료',
        url: 'https://www.figma.com/file/ZeamQLoDzhVkQtPWvsTHhN/PRIZM-(APP)?node-id=16057%3A129737&t=n5v0nCIZZs4ZVHgV-4',
      },
      ...(reference.parameters?.design || []),
    ],
  },
  args: {
    expanded: true,
  },
} as ComponentMeta<typeof CouponList>;

const Template: ComponentStory<typeof CouponList> = ({ ...args }) => <CouponList {...args} />;

export const 다운로드전_1개 = Template.bind({});
다운로드전_1개.args = { downloadableCoupons: [createCoupon()] };

export const 다운로드전_여러개 = Template.bind({});
다운로드전_여러개.args = { downloadableCoupons: [createCoupon(), createCoupon(), createCoupon()] };

export const 다운로드후_1개 = Template.bind({});
다운로드후_1개.args = { downloadedCoupons: [createCoupon()] };

export const 다운로드후_여러개 = Template.bind({});
다운로드후_여러개.args = { downloadedCoupons: [createCoupon(), createCoupon(), createCoupon()] };

export const 미다운로드_1개 = Template.bind({});
미다운로드_1개.args = {
  downloadableCoupons: [createCoupon()],
  downloadedCoupons: [createCoupon(), createCoupon()],
};

export const 미다운로드_여러개 = Template.bind({});
미다운로드_여러개.args = {
  downloadableCoupons: [createCoupon(), createCoupon()],
  downloadedCoupons: [createCoupon(), createCoupon()],
};
