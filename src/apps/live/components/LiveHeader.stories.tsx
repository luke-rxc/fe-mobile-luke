import { LiveContentsType } from '@constants/live';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { LiveHeader } from './LiveHeader';

export default {
  title: 'Features/Live/LiveHeader',
  component: LiveHeader,
} as ComponentMeta<typeof LiveHeader>;

const Template: ComponentStory<typeof LiveHeader> = (args) => {
  return <LiveHeader {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  showroom: {
    type: 'NORMAL',
    id: 1,
    code: 'muji',
    name: '나이키쇼룸',
    primaryImage: {
      blurHash: '',
      height: 100,
      id: 166,
      path: 'https://cdn-dev.prizm.co.kr/showcase/20210806/c4971102-7033-4c3b-835e-04164a2a751f',
      width: 100,
    },
    backgroundColor: '#E5FFCC',
    contentColor: '#1E1646',
    textColor: '#FFFFFF',
    tintColor: '#9587ED',
  },
  contentsType: LiveContentsType.STANDARD,
};
