import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { CollapseSection } from './CollapseSection';

export default {
  title: `${StoriesMenu.Apps}/Mypage/Orders/Components/CollapseSection`,
  component: CollapseSection,
} as ComponentMeta<typeof CollapseSection>;

const Template: ComponentStory<typeof CollapseSection> = ({ ...args }) => <CollapseSection {...args} />;

export const 기본 = Template.bind({});

기본.args = {
  title: '제목',
  children: '콘텐츠',
};
