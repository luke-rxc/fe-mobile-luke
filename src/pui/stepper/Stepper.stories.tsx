import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Stepper, StepperComponent } from './Stepper';

export default {
  title: `${StoriesMenu.PDS.DataEntry}/Stepper/Stepper`,
  component: Stepper,
  parameters: {
    design: [
      {
        name: 'figma - PDS',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=25936-58425&t=cbYSTKV4DFHnR9tn-4',
      },
    ],
  },
} as ComponentMeta<typeof StepperComponent>;

const Template: ComponentStory<typeof StepperComponent> = ({ ...args }) => <Stepper {...args} />;

export const 기본 = Template.bind({});

export const 비활성화 = Template.bind({});
비활성화.args = {
  disabled: true,
};
