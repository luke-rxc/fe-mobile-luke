import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StreamViewer } from './StreamViewer';

export default {
  title: 'Features/Live/StreamViewer',
  component: StreamViewer,
} as ComponentMeta<typeof StreamViewer>;

const Template: ComponentStory<typeof StreamViewer> = (args) => {
  return <StreamViewer {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  streamUrl: 'https://dev-showtime-live.cdn.ntruss.com/live/video/ls-20211021163740-tJgEn/playlist.m3u8',
};
