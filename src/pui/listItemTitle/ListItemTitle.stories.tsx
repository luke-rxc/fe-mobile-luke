import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { List } from '@pui/list';
import { ListItemTitle } from './ListItemTitle';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/List/ListItemTitle`,
  component: ListItemTitle,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7126%3A35097',
    },
  },
  argTypes: {
    is: { table: { disable: true } },
  },
} as ComponentMeta<typeof ListItemTitle>;

const Template: ComponentStory<typeof ListItemTitle> = (args) => {
  return (
    <List>
      <ListItemTitle {...args} />
    </List>
  );
};

export const 기본 = Template.bind({});
기본.args = {
  title: '제목',
  suffix: '값',
  noArrow: false,
  link: undefined,
};

export const linked = Template.bind({});
linked.args = {
  title: '제목',
  suffix: '값',
  noArrow: false,
  link: 'https://prizm.co.kr/',
};

export const noArrow = Template.bind({});
noArrow.args = {
  title: '제목',
  suffix: '값',
  noArrow: true,
  link: undefined,
};

export const onlyText = Template.bind({});
onlyText.args = {
  title: '제목',
  suffix: undefined,
  noArrow: true,
  link: undefined,
};

export const multiLine = Template.bind({});
multiLine.args = {
  title: new Array(100).fill('텍스트').join(' '),
  suffix: '값',
  noArrow: false,
  link: undefined,
};
