import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { List } from '@pui/list';
import { ListItemText } from './ListItemText';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/List/ListItemText`,
  component: ListItemText,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7126%3A35145',
    },
  },
  argTypes: {
    is: { table: { disable: true } },
  },
} as ComponentMeta<typeof ListItemText>;

const Template: ComponentStory<typeof ListItemText> = (args) => {
  return (
    <List>
      <ListItemText {...args} />
    </List>
  );
};

export const small = Template.bind({});
small.args = {
  text: '회원 가입, 상품 주문 이행을 위해 필수적인 정보를 직접 입력',
};

export const medium = Template.bind({});
medium.args = {
  text: '회원 가입, 상품 주문 이행을 위해 필수적인 정보를 직접 입력',
};

export const multiLine = Template.bind({});
multiLine.args = {
  text: new Array(100).fill('텍스트').join(' '),
};
