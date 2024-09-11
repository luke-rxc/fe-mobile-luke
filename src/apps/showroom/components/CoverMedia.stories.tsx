import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { CoverMedia } from './CoverMedia';
import reference from './ContentList.stories';

export default {
  title: `${StoriesMenu.Apps}/Showroom/components/CoverMedia`,
  component: CoverMedia,
  parameters: {
    design: reference.parameters?.design,
  },
  args: {
    videoURL:
      'https://cdn-image.prizm.co.kr/showroom/20221110/a9edd3c3-d9bc-4e96-b272-9eb9e6575bce/original.mp4?im=Resize,width=1080',
    imageURL:
      'https://cdn-image.prizm.co.kr/showroom/20221110/a9edd3c3-d9bc-4e96-b272-9eb9e6575bce/1080.0000000.jpg?im=Resize,width=1440',
    blurHash:
      '|8B2lbo}0~$*WVwIIU57ni1K%1}sSNWWEMNGwvR*9bM|R+Nao0%1%2-UkCVYM{I:RjkCxutRozt6slRjRjxZW;S4xGS4W;ozkCs.ofjZaKNGWBaet7xtozWXRkIpRjn$jFs:s:bbR*o0s:W;ayR+NGWCofsns.oyt6babH',
    width: 1080,
    height: 1440,
  },
} as ComponentMeta<typeof CoverMedia>;

const Template: ComponentStory<typeof CoverMedia> = ({ ...args }) => <CoverMedia {...args} />;

export const 비디오타입 = Template.bind({});

export const 이미지타입 = Template.bind({});
이미지타입.args = {
  videoURL: undefined,
};

export const 미디어로드_실패 = Template.bind({});
미디어로드_실패.args = {
  videoURL: '유효하지않는경로',
  imageURL: '유효하지않는경로',
};
