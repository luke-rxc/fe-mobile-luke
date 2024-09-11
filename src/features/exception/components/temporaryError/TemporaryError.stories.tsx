import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TemporaryError } from './TemporaryError';

export default {
  title: 'features/Exception/TemporaryError',
  component: TemporaryError,
} as ComponentMeta<typeof TemporaryError>;

const Template: ComponentStory<typeof TemporaryError> = (args) => {
  return (
    <div style={{ maxWidth: '375px', height: '812px', margin: '0 auto' }}>
      <TemporaryError />
    </div>
  );
};

export const 일시적인_에러 = Template.bind({});
일시적인_에러.args = {};
