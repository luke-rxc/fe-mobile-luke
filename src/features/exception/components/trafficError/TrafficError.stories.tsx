import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TrafficError } from './TrafficError';

export default {
  title: 'features/Exception/TrafficError',
  component: TrafficError,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=19715%3A50112',
    },
  },
} as ComponentMeta<typeof TrafficError>;

const Template: ComponentStory<typeof TrafficError> = (args) => {
  return (
    <div style={{ maxWidth: '375px', height: '812px', margin: '0 auto' }}>
      <TrafficError />
    </div>
  );
};

export const 트래픽_몰릴때_페이지 = Template.bind({});
트래픽_몰릴때_페이지.args = {};
