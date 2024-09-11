import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LivePreview } from './LivePreview';

export default {
  title: 'Features/Live/LivePreview',
  component: LivePreview,
} as ComponentMeta<typeof LivePreview>;

const Template: ComponentStory<typeof LivePreview> = (args) => {
  return <LivePreview {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  coverImage: 'https://cdn-dev.prizm.co.kr/showcase/20210809/b6baa903-99dd-4e37-8607-b916d311bc23',
  title: '#아름다움은 자란다',
  description:
    '윤조 에센스 리미티드 에디션을 특별한 가격에 만나보세요. 피부 장벽을 다각도로 케어해 더 힘있게 빛나는 피부',
};
