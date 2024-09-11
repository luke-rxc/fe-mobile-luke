import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { List } from '@pui/list';
import { ListItemButton } from './ListItemButton';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/List/ListItemButton`,
  component: ListItemButton,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=39958-47668&mode=dev',
    },
  },
  argTypes: {
    is: { table: { disable: true } },
  },
} as ComponentMeta<typeof ListItemButton>;

const Template: ComponentStory<typeof ListItemButton> = (args) => {
  return (
    <List>
      <ListItemButton {...args} />
    </List>
  );
};

export const 기본 = Template.bind({});
기본.args = {
  title: '상세 주소',
};

export const description = Template.bind({});
description.args = {
  title: '상세 주소',
  description: '장소명',
};

export const multiLine = Template.bind({});
multiLine.args = {
  title: new Array(30).fill('텍스트').join(' '),
  description: '장소명',
};
