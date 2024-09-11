import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { ContentListItem } from './ContentListItem';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/Content/ContentListItem`,
  component: ContentListItem,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=11332%3A38304',
    },
  },
} as ComponentMeta<typeof ContentListItem>;

const Template: ComponentStory<typeof ContentListItem> = ({ ...args }) => {
  return (
    <div>
      <ContentListItem {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  id: 21225,
  code: 'wowdraw3rd',
  name: '아이패드 프로 응모',
  startDate: 1646964000000,
  imageProps: {
    path: 'https://cdn-image.prizm.co.kr/story/20220315/da6af664-30da-49a4-ba3a-e008a7f40eb9.jpeg',
    blurHash:
      '|vE9w-S#a:nmnyWYR~oMa*afa#WFayj?oLk9a}j[fqoLoXWoWZn%fAWXfNR.ayo0oLbHayj?o0j@o5azbCoLa~WVo3oLWUoOj@bDa|juj@a#WWa{awf7WYWVoJoLbFWVoLs;j[j=ayjba#a#fQayR%azajj@fibGj?oKoL',
  },
  contentType: 'teaser',
  release: true,
};

export const NoBlurhash = Template.bind({});
NoBlurhash.args = {
  id: 21225,
  code: 'wowdraw3rd',
  name: '아이패드 프로 응모',
  startDate: 1646964000000,
  imageProps: {
    path: 'https://cdn-image.prizm.co.kr/story/20220315/da6af664-30da-49a4-ba3a-e008a7f40eb9.jpeg',
  },
  contentType: 'teaser',
  release: true,
};

export const 공개예정 = Template.bind({});
공개예정.args = {
  id: 21225,
  code: 'wowdraw3rd',
  name: '아이패드 프로 응모',
  startDate: 1646964000000,
  imageProps: {
    path: 'https://cdn-image.prizm.co.kr/story/20220315/da6af664-30da-49a4-ba3a-e008a7f40eb9.jpeg',
    blurHash:
      '|vE9w-S#a:nmnyWYR~oMa*afa#WFayj?oLk9a}j[fqoLoXWoWZn%fAWXfNR.ayo0oLbHayj?o0j@o5azbCoLa~WVo3oLWUoOj@bDa|juj@a#WWa{awf7WYWVoJoLbFWVoLs;j[j=ayjba#a#fQayR%azajj@fibGj?oKoL',
  },
  contentType: 'teaser',
  release: false,
};

export const 한줄줄임 = Template.bind({});
한줄줄임.args = {
  id: 21225,
  code: 'wowdraw3rd',
  name: '고유의 컬러와 텍스처, 분위기만으로 풍겨지는 우아한 취향이 오롯이 그녀의 것으로 표현되는 시엔느의 2022 Spring Collection을 만나보세요 고유의 컬러와 텍스처, 분위기만으로 풍겨지는 우아한 취향이 오롯이 그녀의 것으로 표현되는 시엔느의 2022 Spring Collection을 만나보세요',
  startDate: 1646964000000,
  imageProps: {
    path: 'https://cdn-image.prizm.co.kr/story/20220315/da6af664-30da-49a4-ba3a-e008a7f40eb9.jpeg',
    blurHash:
      '|vE9w-S#a:nmnyWYR~oMa*afa#WFayj?oLk9a}j[fqoLoXWoWZn%fAWXfNR.ayo0oLbHayj?o0j@o5azbCoLa~WVo3oLWUoOj@bDa|juj@a#WWa{awf7WYWVoJoLbFWVoLs;j[j=ayjba#a#fQayR%azajj@fibGj?oKoL',
  },
  contentType: 'teaser',
  release: true,
};
