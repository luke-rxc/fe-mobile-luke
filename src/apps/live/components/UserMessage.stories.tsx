import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UserMessage } from './UserMessage';

export default {
  title: 'Features/Live/UserMessage',
  component: UserMessage,
} as ComponentMeta<typeof UserMessage>;

const Template: ComponentStory<typeof UserMessage> = (args) => {
  return <UserMessage {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  profileUrl: 'https://cdn-dev.prizm.co.kr/showcase/20210914/debb19b4-4f9a-4736-bd45-f8647314e064',
  nickname: 'luke',
  message: '기다린 제품 드디어 나왔네요ㅎㅎ',
};
