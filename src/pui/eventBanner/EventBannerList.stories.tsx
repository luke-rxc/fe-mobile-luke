import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { EventBannerList, EventBannerListProps } from './EventBannerList';
import { EventBannerItemProps } from './EventBannerItem';

export default {
  title: `${StoriesMenu.PDS.DataDisplay}/BannerConcept/EventBannerList`,
  component: EventBannerList,
  parameters: {
    design: [
      {
        name: 'figma - PDS',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=22364%3A56898&t=0HE0u246vkqHgTIv-4',
      },
      {
        name: 'figma - 정책',
        type: 'figma',
        url: 'https://www.figma.com/file/G08zxegRFA3a1kF0ZMCaXa/PDS?node-id=22364%3A60172&t=jCTw165r3XDeNxA7-4',
      },
    ],
  },
} as ComponentMeta<typeof EventBannerList>;

const Template: ComponentStory<typeof EventBannerList> = ({ ...args }) => <EventBannerList {...args} />;

export const SingleLayerImage = Template.bind({});
SingleLayerImage.args = {
  list: [
    {
      id: 1,
      title: 'PRIZM LUX Guarantee 1',
      subTitle: '1단계 감정으로 보증된 정품과 품질',
      bgColor: '#8662D2',
      textColor: '#CCC',
      primaryMedia: {
        type: 'IMAGE',
        path: 'https://cdn-image.prizm.co.kr/story/20220301/3376c15f-aa12-4c38-9905-cf0930692a35.png?im=Resize,width=512',
      },
      link: '',
    },
  ],
};

export const SingleLayerVideo = Template.bind({});
SingleLayerVideo.args = {
  list: [
    {
      id: 1,
      title: 'PRIZM LUX Guarantee 1',
      subTitle: '1단계 감정으로 보증된 정품과 품질',
      bgColor: '#8662D2',
      textColor: '#CCC',
      primaryMedia: {
        type: 'VIDEO',
        path: 'https://cdn-image-dev.prizm.co.kr/goods/20221227/401f9920-47ac-408e-98eb-0ad438a0392b/1080.mp4',
        thumbnailImage: {
          path: 'https://cdn-image-dev.prizm.co.kr/goods/20221227/401f9920-47ac-408e-98eb-0ad438a0392b/1080.0000000.jpg',
        },
      },
      link: '',
    },
  ],
};

export const SingleLayerSvg = Template.bind({});
SingleLayerSvg.args = {
  list: [
    {
      id: 5,
      title: 'SVG',
      subTitle: '2단계 감정으로 보증된 정품과 품질',
      bgColor: '#F6C032',
      textColor: '#202020',
      primaryMedia: {
        type: 'SVG',
        path: 'https://cdn-image.prizm.co.kr/brand/20220316/3078567d-0da4-497e-a50a-749ba2de2b7d.svg',
      },
      link: '',
    },
  ],
};

export const SingleLayerLottieLoop = Template.bind({});
SingleLayerLottieLoop.args = {
  list: [
    {
      id: 3,
      title: 'Lottie Loop',
      subTitle: '2단계 감정으로 보증된 정품과 품질',
      bgColor: '#f00',
      textColor: '#fff',
      primaryMedia: {
        type: 'LOTTIE',
        path: 'https://mweb-dev.prizm.co.kr/static/dummyVideo/bell_filled.json',
        loop: true,
      },
      link: '',
    },
  ],
};

export const SingleLayerLottieNoLoop = Template.bind({});
SingleLayerLottieNoLoop.args = {
  list: [
    {
      id: 3,
      title: 'Lottie Loop',
      subTitle: '2단계 감정으로 보증된 정품과 품질',
      bgColor: '#f00',
      textColor: '#fff',
      primaryMedia: {
        type: 'LOTTIE',
        path: 'https://mweb-dev.prizm.co.kr/static/dummyVideo/bell_filled.json',
        loop: false,
      },
      link: '',
    },
  ],
};

export const MultiLayer = Template.bind({});
MultiLayer.args = {
  list: [
    {
      id: 1,
      title: 'PRIZM LUX Guarantee 1',
      subTitle: '1단계 감정으로 보증된 정품과 품질',
      bgColor: '#8662D2',
      textColor: '#CCC',
      primaryMedia: {
        type: 'IMAGE',
        path: 'https://cdn-image.prizm.co.kr/story/20220301/3376c15f-aa12-4c38-9905-cf0930692a35.png?im=Resize,width=512',
      },
      secondaryMedia: {
        type: 'VIDEO',
        path: 'https://cdn-image-dev.prizm.co.kr/goods/20221227/401f9920-47ac-408e-98eb-0ad438a0392b/1080.mp4',
        thumbnailImage: {
          path: 'https://cdn-image-dev.prizm.co.kr/goods/20221227/401f9920-47ac-408e-98eb-0ad438a0392b/1080.0000000.jpg',
        },
      },
      link: '',
    },
  ],
};

export const 글자수_처리 = Template.bind({});
글자수_처리.args = {
  list: [
    {
      id: 6,
      title: '타이틀 길어질때의 체크 ABCDE 타이틀 길어질때의 체크 ABCDE',
      subTitle: '서브 타이틀 길어질때의 체크 ABCDE 서브 타이틀 길어질때의 체크 ABCDE',
      bgColor: '#eee',
      textColor: '#202020',
      primaryMedia: {
        type: 'IMAGE',
        path: 'https://cdn-image.prizm.co.kr/story/20221201/6ab82275-2086-49f1-9d84-47002df35be0.png?im=Resize,width=512',
      },
      link: '',
    },
  ],
};

type BannerListProps = EventBannerListProps['list'];
const singleBannerList: BannerListProps = [
  {
    id: 1,
    title: 'PRIZM LUX Guarantee 1',
    subTitle: '1단계 감정으로 보증된 정품과 품질',
    bgColor: '#8662D2',
    textColor: '#CCC',
    primaryMedia: {
      type: 'IMAGE',
      path: 'https://cdn-image.prizm.co.kr/story/20220301/3376c15f-aa12-4c38-9905-cf0930692a35.png?im=Resize,width=512',
    },
    secondaryMedia: {
      type: 'VIDEO',
      path: 'https://cdn-image-dev.prizm.co.kr/goods/20221227/401f9920-47ac-408e-98eb-0ad438a0392b/1080.mp4',
      thumbnailImage: {
        path: 'https://cdn-image-dev.prizm.co.kr/goods/20221227/401f9920-47ac-408e-98eb-0ad438a0392b/1080.0000000.jpg',
      },
    },
    link: '',
  },
];

const bannerList: BannerListProps = [
  {
    // 22853
    id: 1,
    title: 'Video + Image(Png)',
    subTitle: '1단계 감정으로 보증된 정품과 품질',
    bgColor: '#8662D2',
    textColor: '#CCC',
    secondaryMedia: {
      type: 'VIDEO',
      path: 'https://cdn-image-dev.prizm.co.kr/goods/20221227/401f9920-47ac-408e-98eb-0ad438a0392b/1080.mp4',
      thumbnailImage: {
        path: 'https://cdn-image-dev.prizm.co.kr/goods/20221227/401f9920-47ac-408e-98eb-0ad438a0392b/1080.0000000.jpg',
      },
    },
    primaryMedia: {
      type: 'IMAGE',
      path: 'https://cdn-image.prizm.co.kr/story/20220301/3376c15f-aa12-4c38-9905-cf0930692a35.png?im=Resize,width=512',
    },
    link: '',
  },
  {
    id: 2,
    title: 'Image(Png) + Image(Jpeg)',
    subTitle: '2단계 감정으로 보증된 정품과 품질',
    bgColor: '#B94121',
    textColor: '#fff',
    primaryMedia: {
      type: 'IMAGE',
      path: 'https://cdn-image.prizm.co.kr/story/20220301/3376c15f-aa12-4c38-9905-cf0930692a35.png?im=Resize,width=512',
    },
    secondaryMedia: {
      type: 'IMAGE',
      path: 'https://cdn-image-dev.prizm.co.kr/story/20220616/22deed41-84e9-4ecb-9fb1-a5c256f39b40.jpeg?im=Resize,width=512',
    },
    link: '',
  },
  {
    id: 3,
    title: 'Lottie Loop',
    subTitle: '2단계 감정으로 보증된 정품과 품질',
    bgColor: '#f00',
    textColor: '#fff',
    primaryMedia: {
      type: 'LOTTIE',
      path: 'https://mweb-dev.prizm.co.kr/static/dummyVideo/bell_filled.json',
      loop: true,
    },
    link: '',
  },
  {
    id: 4,
    title: 'Image(Png) + Image(Png)',
    subTitle: '2단계 감정으로 보증된 정품과 품질',
    bgColor: '#eee',
    textColor: '#202020',
    primaryMedia: {
      type: 'IMAGE',
      path: 'https://cdn-image.prizm.co.kr/story/20220301/3376c15f-aa12-4c38-9905-cf0930692a35.png?im=Resize,width=512',
    },
    secondaryMedia: {
      type: 'IMAGE',
      path: 'https://cdn-image.prizm.co.kr/story/20221201/6ab82275-2086-49f1-9d84-47002df35be0.png?im=Resize,width=512',
    },
    link: '',
  },
  {
    id: 5,
    title: 'SVG',
    subTitle: '2단계 감정으로 보증된 정품과 품질',
    bgColor: '#F6C032',
    textColor: '#202020',
    primaryMedia: {
      type: 'SVG',
      path: 'https://cdn-image.prizm.co.kr/brand/20220316/3078567d-0da4-497e-a50a-749ba2de2b7d.svg',
    },
    link: '',
  },
  {
    id: 6,
    title: '타이틀 길어질때의 체크 ABCDE 타이틀 길어질때의 체크 ABCDE',
    subTitle: '서브 타이틀 길어질때의 체크 ABCDE 서브 타이틀 길어질때의 체크 ABCDE',
    bgColor: '#eee',
    textColor: '#202020',
    primaryMedia: {
      type: 'IMAGE',
      path: 'https://cdn-image.prizm.co.kr/story/20221201/6ab82275-2086-49f1-9d84-47002df35be0.png?im=Resize,width=512',
    },
    link: '',
  },
];

const SwiperTemplate: ComponentStory<typeof EventBannerList> = ({ ...args }) => (
  <Wrapper>
    <p className="proto-title">Banner Test Page</p>
    <div className="proto-dummy">Dummy</div>
    <div className="proto-dummy">Dummy</div>
    <div className="proto-dummy">Dummy</div>
    <EventBannerList {...args} />
  </Wrapper>
);

const Wrapper = styled.div`
  .proto-title {
    font: ${({ theme }) => theme.fontType.t20B};
    padding: 1rem 0;
  }

  .proto-dummy {
    width: 100%;
    height: 40rem;
    margin-bottom: 1rem;
    background: ${({ theme }) => theme.color.gray50};
    color: ${({ theme }) => theme.color.black};
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const SingleBanner = SwiperTemplate.bind({});
SingleBanner.args = {
  list: singleBannerList,
};

export const MultipleBanner = SwiperTemplate.bind({});
MultipleBanner.args = {
  list: bannerList,
};

export const BannerClick = Template.bind({});
BannerClick.args = {
  list: bannerList,
  onClick: (itemInfo: EventBannerItemProps) => {
    window.alert(JSON.stringify(itemInfo));
  },
};
