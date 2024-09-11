import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { ListItemTable } from '@pui/listItemTable';
import { ListItemText } from '@pui/listItemText';
import { ListItemTitle } from '@pui/listItemTitle';
import { List } from './List';

export default {
  title: `${StoriesMenu.NonPDS}/List`,
  component: List,
  argTypes: {
    is: {
      options: ['ul', 'ol'],
      control: { type: 'select' },
      description: '`ul`과 `ol`중 렌더할 HTML Tag를 선택할 수 있습니다.',
    },
  },
} as ComponentMeta<typeof List>;

const Template: ComponentStory<typeof List> = (args) => <List {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  is: 'ul',
  children: ['1', '2', '3'].map((key) => <ListItemText key={key} text="text" />),
};

export const DottedList = Template.bind({});
DottedList.args = {
  is: 'ul',
  children: ['1', '2', '3'].map((key) => <ListItemText key={key} text="text" />),
};

export const TitleList = Template.bind({});
TitleList.args = {
  is: 'ul',
  children: ['1', '2', '3'].map((key) => <ListItemTitle key={key} title="title" suffix="값" link="#" />),
};

export const DescriptionList = Template.bind({});
DescriptionList.args = {
  is: 'ul',
  children: ['1', '2', '3'].map((key) => <ListItemTable key={key} title="title" text="text" />),
};
