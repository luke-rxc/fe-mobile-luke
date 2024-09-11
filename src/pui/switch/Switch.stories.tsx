/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Switch } from './Switch';

export default {
  title: `${StoriesMenu.PDS.DataEntry}/Switch/Switch`,
  component: Switch,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?type=design&node-id=29901-104739&mode=design&t=Uj34sqOBT6tdSKLD-4',
    },
  },
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = ({ ...args }) => {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const parent = ref?.current?.parentElement;

    if (parent) {
      parent.classList.remove('is-aos');
      parent.classList.add('is-ios');
    }
  }, [args.block, args.readOnly, ref.current]);

  return (
    <>
      <Switch {...args} />
      <Switch {...args} ref={ref} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  readOnly: false,
  block: false,
  disabled: false,
};
