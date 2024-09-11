import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ProfileInfo } from './ProfileInfo';

export default {
  title: 'Features/Live/ProfileInfo',
  component: ProfileInfo,
} as ComponentMeta<typeof ProfileInfo>;

const Template: ComponentStory<typeof ProfileInfo> = (args) => {
  return <ProfileInfo {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  profileUrl: 'https://cdn-dev.prizm.co.kr/showcase/20210914/debb19b4-4f9a-4736-bd45-f8647314e064',
  nickname: 'luke',
};
