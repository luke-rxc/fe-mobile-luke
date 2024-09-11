import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { List } from '@pui/list';
import { InfantFilled } from '@pui/icon';
import { ListItemSelect } from './ListItemSelect';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/List/ListItemSelect`,
  component: ListItemSelect,
} as ComponentMeta<typeof ListItemSelect>;

const Template: ComponentStory<typeof ListItemSelect> = (args) => (
  <List>
    <ListItemSelect {...args} />
  </List>
);

export const 기본 = Template.bind({});
기본.args = {
  title: 'Title',
  is: 'li',
  type: 'radio',
};

export const checkbox = Template.bind({});
checkbox.args = {
  title: 'Title',
  is: 'li',
  type: 'checkbox',
};

export const description = Template.bind({});
description.args = {
  title: 'Title',
  is: 'li',
  description: 'Description',
};

export const disabled = Template.bind({});
disabled.args = {
  title: 'Title',
  description: 'Description',
  disabled: true,
  is: 'li',
};

export const useCase1 = Template.bind({});
useCase1.args = {
  type: 'checkbox',
  is: 'li',
  title: (
    <>
      Title
      <InfantFilled style={{ marginLeft: 4 }} />
    </>
  ),
};

const Template2: ComponentStory<typeof ListItemSelect> = () => (
  <List
    source={[
      { title: '색상 또는 사이즈', defaultChecked: true },
      { title: '상품 설명과 다름' },
      { title: '상품 불량' },
      { title: '다른 상품 배송됨' },
      { title: '상품 누락' },
      { title: '다른 곳으로 배송됨' },
    ]}
    render={(item, index) => <ListItemSelect key={index} is="li" type="radio" name="option" {...item} />}
  />
);

export const useCase2 = Template2.bind({});
