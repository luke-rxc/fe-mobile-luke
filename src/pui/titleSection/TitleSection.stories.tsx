import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { ChevronRight } from '@pui/icon';
import { Button } from '@pui/button';
import { ButtonText } from '@pui/buttonText';
import { TitleSection, TitleSectionComponent } from './TitleSection';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Title/TitleSection`,
  component: TitleSection,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=1609-2549&mode=design&t=UXvPYbX1lIsAu2cq-4',
    },
  },
} as ComponentMeta<typeof TitleSectionComponent>;

const Template: ComponentStory<typeof TitleSectionComponent> = ({ onClickLink, ...args }) => {
  return (
    <div style={{ border: '1px solid #eee' }}>
      <TitleSection {...args} />
    </div>
  );
};

export const 기본 = Template.bind({});
기본.args = {
  title: 'Title',
};

export const subtitle = Template.bind({});
subtitle.args = {
  title: 'Title',
  subtitle: 'subtitle',
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
  link: '#',
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
