import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { List } from '@pui/list';
import { ListItemTable } from './ListItemTable';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Table/ListItemTable`,
  component: ListItemTable,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7171%3A31202',
    },
  },
  argTypes: {
    is: { table: { disable: true } },
  },
} as ComponentMeta<typeof ListItemTable>;

const Template: ComponentStory<typeof ListItemTable> = (args) => {
  return (
    <List>
      <ListItemTable {...args} />
    </List>
  );
};

export const 기본 = Template.bind({});
기본.args = {
  title: 'Title',
  text: 'Descriptions',
  titleWidth: 80,
  textAlign: 'left',
};

export const multiLine = Template.bind({});
multiLine.args = {
  title: new Array(3).fill('Title').join(' '),
  text: new Array(100).fill('Descriptions').join(' '),
  titleWidth: 80,
  textAlign: 'left',
};
