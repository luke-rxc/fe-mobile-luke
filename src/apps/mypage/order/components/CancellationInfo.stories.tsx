import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { CancellationInfo } from './CancellationInfo';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/CancellationInfo`,
  component: CancellationInfo,
} as ComponentMeta<typeof CancellationInfo>;

const Template: ComponentStory<typeof CancellationInfo> = ({ ...args }) => <CancellationInfo {...args} />;

export const 기본 = Template.bind({});

기본.args = {
  cancelableDate: new Date().getTime(),
};
