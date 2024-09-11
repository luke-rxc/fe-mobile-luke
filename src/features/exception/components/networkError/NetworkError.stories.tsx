import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NetworkError } from './NetworkError';

export default {
  title: 'features/Exception/NetworkError',
  component: NetworkError,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=10816%3A51517',
    },
  },
} as ComponentMeta<typeof NetworkError>;

const Template: ComponentStory<typeof NetworkError> = (args) => {
  return (
    <div style={{ maxWidth: '375px', height: '812px', margin: '0 auto' }}>
      <NetworkError />
    </div>
  );
};

export const 네트워크_에러 = Template.bind({});
네트워크_에러.args = {};
