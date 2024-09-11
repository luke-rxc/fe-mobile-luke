import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Spinner } from './Spinner';

export default {
  title: `${StoriesMenu.PDS.DataEntry}/Spinner/Spinner`,
  component: Spinner,
} as ComponentMeta<typeof Spinner>;

const Template: ComponentStory<typeof Spinner> = (args) => <Spinner {...args} />;

export const 기본 = Template.bind({});
기본.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=7013%3A29312',
  },
};
기본.args = {
  size: 'large',
};
