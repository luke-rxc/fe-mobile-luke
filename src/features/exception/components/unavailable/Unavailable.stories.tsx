import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Unavailable } from './Unavailable';

export default {
  title: 'features/Exception/Unavailable',
  component: Unavailable,
} as ComponentMeta<typeof Unavailable>;

const Template: ComponentStory<typeof Unavailable> = (args) => {
  return (
    <div style={{ maxWidth: '375px', height: '812px', margin: '0 auto' }}>
      <Unavailable {...args} />
    </div>
  );
};

export const 서비스_정검 = Template.bind({});

서비스_정검.args = {
  startDate: '2:00',
  endDate: '4:00',
};
