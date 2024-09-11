import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Footer } from './Footer';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Footer/Footer`,
  component: Footer,
  argTypes: {
    is: { control: { type: 'select' } },
  },
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = ({ ...args }) => <Footer {...args} />;

export const 기본 = Template.bind({});
기본.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=14341%3A47037',
  },
};
