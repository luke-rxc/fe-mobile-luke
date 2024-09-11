import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AuctionMessage } from './AuctionMessage';

export default {
  title: 'Features/Live/AuctionMessage',
  component: AuctionMessage,
} as ComponentMeta<typeof AuctionMessage>;

const Template: ComponentStory<typeof AuctionMessage> = (args) => {
  return <AuctionMessage {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  profileUrl: 'https://cdn-dev.prizm.co.kr/showcase/20210914/debb19b4-4f9a-4736-bd45-f8647314e064',
  nickname: 'luke',
  message: '11,000₩',
};
