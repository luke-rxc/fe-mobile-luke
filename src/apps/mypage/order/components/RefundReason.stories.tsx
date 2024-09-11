import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { RefundReason } from './RefundReason';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/RefundReason`,
  component: RefundReason,
  args: {
    title: '취소 사유',
    placeholder: ' 취소 사유 선택',
    reasons: [
      { code: '1', text: '단순 변심' },
      { code: '2', text: '주문 실수' },
      { code: '3', text: '재주문' },
      { code: '900', text: '기타' },
    ],
    reasonCodeError: false,
    reasonError: false,
    showReasonText: false,
  },
} as ComponentMeta<typeof RefundReason>;

const Template: ComponentStory<typeof RefundReason> = (args) => <RefundReason {...args} />;

export const Default = Template.bind({});
export const 상세내용입력창_노출 = Template.bind({});
상세내용입력창_노출.args = {
  showReasonText: true,
};
export const Error = Template.bind({});
Error.args = {
  reasonCodeError: true,
  reasonError: true,
  showReasonText: true,
};
