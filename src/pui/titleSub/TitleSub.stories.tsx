import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { ChevronRight } from '@pui/icon';
import { Button } from '@pui/button';
import { ButtonText } from '@pui/buttonText';
import { TitleSub } from './TitleSub';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Title/TitleSub`,
  component: TitleSub,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=2548-2946&mode=design&t=UXvPYbX1lIsAu2cq-4',
    },
  },
} as ComponentMeta<typeof TitleSub>;

const Template: ComponentStory<typeof TitleSub> = ({ ...args }) => (
  <div style={{ border: '1px solid #eee' }}>
    <TitleSub {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Title',
};

export const Regular = Template.bind({});
Regular.args = {
  title: 'Title',
  noBold: true,
};

export const ellipsis = Template.bind({});
ellipsis.args = {
  title: new Array(100).fill('Title').join(''),
  subtitle: new Array(100).fill('subtitle').join(''),
};

export const suffixIcon = Template.bind({});
suffixIcon.args = {
  title: new Array(100).fill('Title').join(''),
  subtitle: new Array(100).fill('subtitle').join(''),
  suffix: <ChevronRight size="2.4rem" />,
};

export const suffixButton = Template.bind({});
suffixButton.args = {
  title: new Array(100).fill('Title').join(''),
  subtitle: new Array(100).fill('subtitle').join(''),
  suffix: <Button size="medium" variant="tertiaryline" children="Button" />,
};

export const suffixButtonText = Template.bind({});
suffixButtonText.args = {
  title: new Array(100).fill('Title').join(''),
  subtitle: new Array(100).fill('subtitle').join(''),
  suffix: <ButtonText children="Button" />,
};
