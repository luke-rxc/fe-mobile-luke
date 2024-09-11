import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Image } from './Image';

export default {
  title: `${StoriesMenu.NonPDS}/Image`,
  component: Image,
} as ComponentMeta<typeof Image>;

const Template: ComponentStory<typeof Image> = ({ ...args }) => <Image {...args} />;

export const 기본 = Template.bind({});
기본.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=8831%3A46645',
  },
};
기본.args = {
  src: 'https://cdn-image.prizm.co.kr/goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
  width: '100%',
  height: '100%',
  lazy: false,
  thresholdBaseLine: false,
  blurHash: '',
  noFadeIn: false,
  fallbackSize: 'small',
  noFallback: false,
  radius: 0,
};

export const blurHash = Template.bind({});
blurHash.args = {
  src: 'https://cdn-image.prizm.co.kr/goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a.jpeg',
  blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
  width: '200px',
  height: '200px',
  lazy: true,
  thresholdBaseLine: false,
  noFadeIn: false,
  noFallback: false,
  fallbackSize: 'small',
  radius: 0,
};
export const blurHashError = Template.bind({});
blurHashError.args = {
  ...blurHash.args,
  src: 'https://cdn-image.prizm.co.kr/goods/20220516/3be3d236-44b8-4886-98a5-c6e6484eee3a틀린.jpeg',
};

export const placeHolder = Template.bind({});
placeHolder.args = {
  src: 'https://pngimg.com/uploads/tree/tree_PNG196.png',
  width: '200px',
  height: '200px',
  lazy: true,
  thresholdBaseLine: false,
  noFadeIn: false,
  noFallback: false,
  fallbackSize: 'small',
  radius: 0,
};
export const placeHolderError = Template.bind({});
placeHolderError.args = {
  ...placeHolder.args,
  src: 'https://pngimg.com/uploads/tree/tree_PNG196틀린.png',
};
