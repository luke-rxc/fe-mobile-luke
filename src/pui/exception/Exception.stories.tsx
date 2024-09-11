/* eslint-disable @typescript-eslint/naming-convention */
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Wifi } from '@pui/icon';
import { Exception } from './Exception';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Empty/Exception`,
  component: Exception,
} as ComponentMeta<typeof Exception>;

const Template: ComponentStory<typeof Exception> = (args) => <Exception {...args} />;

export const 기본 = Template.bind({});
기본.args = {
  graphic: <Wifi />,
  title: 'title',
  description: 'description',
  actionLabel: 'Button',
  onAction: () => {},
};
