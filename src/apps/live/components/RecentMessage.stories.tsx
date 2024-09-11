import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RecentMessage } from './RecentMessage';

export default {
  title: 'Features/Live/RecentMessage',
  component: RecentMessage,
} as ComponentMeta<typeof RecentMessage>;

const Template: ComponentStory<typeof RecentMessage> = (args) => {
  return <RecentMessage {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  profileUrl: 'https://cdn-dev.prizm.co.kr/showcase/20210914/debb19b4-4f9a-4736-bd45-f8647314e064',
  nickname: 'luke',
  message: '11,000₩',
};
