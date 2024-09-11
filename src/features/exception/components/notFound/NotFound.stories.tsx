import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NotFound } from './NotFound';

export default {
  title: 'features/Exception/NotFound',
  component: NotFound,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=10816%3A51490',
    },
  },
} as ComponentMeta<typeof NotFound>;

const Template: ComponentStory<typeof NotFound> = (args) => {
  return (
    <div style={{ maxWidth: '375px', height: '812px', margin: '0 auto' }}>
      <NotFound />
    </div>
  );
};

export const 찾을_수_없는_페이지 = Template.bind({});
찾을_수_없는_페이지.args = {};
