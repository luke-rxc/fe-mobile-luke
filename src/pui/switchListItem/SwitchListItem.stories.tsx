/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { NaverFilled } from '@pui/icon';
import { SwitchListItem } from './SwitchListItem';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/List/SwitchListItem`,
  component: SwitchListItem,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=1509%3A2557',
    },
  },
} as ComponentMeta<typeof SwitchListItem>;

const Template: ComponentStory<typeof SwitchListItem> = ({ ...args }) => <SwitchListItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: '제목',
};

export const description = Template.bind({});
description.args = {
  text: '제목',
  description: '설명',
};

export const prefix = Template.bind({});
prefix.args = {
  text: '제목',
  prefix: <NaverFilled colorCode="#24BE61" />,
};
