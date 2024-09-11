import React from 'react';
import styled from 'styled-components';
import { EventBannerList, EventBannerListProps, EventBannerItemProps } from '@pui/eventBanner';

type BannerListProps = EventBannerListProps['list'];

const singleBannerList: BannerListProps = [
  {
    id: 1,
    title: 'PRIZM LUX Guarantee 1',
    subTitle: '1단계 감정으로 보증된 정품과 품질',
    bgColor: '#8662D2',
    textColor: '#CCC',
    primaryMedia: {
      type: 'SVG',
      path: 'https://cdn-image-dev.prizm.co.kr/banner/lux_guarantee1.svg',
    },
    secondaryMedia: {
      type: 'SVG',
      path: 'https://cdn-image-dev.prizm.co.kr/banner/lux_guarantee2.svg',
    },
  },
];

const bannerList: BannerListProps = [
  {
    // 22853
    id: 0,
    title: 'Video + SVG',
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
    secondaryMedia: {
      type: 'SVG',
      path: 'https://cdn-image-dev.prizm.co.kr/banner/lux_guarantee2.svg',
    },
    link: '',
  },
  {
    id: 1,
    title: 'SVG + SVG',
    subTitle: '1단계 감정으로 보증된 정품과 품질',
    bgColor: '#8662D2',
    textColor: '#CCC',
    primaryMedia: {
      type: 'SVG',
      path: 'https://cdn-image-dev.prizm.co.kr/banner/lux_guarantee1.svg',
    },
    secondaryMedia: {
      type: 'SVG',
      path: 'https://cdn-image-dev.prizm.co.kr/banner/lux_guarantee2.svg',
    },
  },
  {
    id: 2,
    title: 'Image(Png) + Image(Jpeg)',
    subTitle: '2단계 감정으로 보증된 정품과 품질',
    bgColor: '#B94121',
    textColor: '#fff',
    primaryMedia: {
      type: 'IMAGE',
      path: 'https://cdn-image-dev.prizm.co.kr/story/20220616/22deed41-84e9-4ecb-9fb1-a5c256f39b40.jpeg?im=Resize,width=512',
    },
    secondaryMedia: {
      type: 'IMAGE',
      path: 'https://cdn-image.prizm.co.kr/story/20220301/3376c15f-aa12-4c38-9905-cf0930692a35.png?im=Resize,width=512',
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
      path: 'https://cdn-image.prizm.co.kr/story/20221201/6ab82275-2086-49f1-9d84-47002df35be0.png?im=Resize,width=512',
    },
    secondaryMedia: {
      type: 'IMAGE',
      path: 'https://cdn-image.prizm.co.kr/story/20220301/3376c15f-aa12-4c38-9905-cf0930692a35.png?im=Resize,width=512',
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

const ProtoBannerPage: React.FC = () => {
  const handleClick = (itemInfo: EventBannerItemProps) => {
    // console.log(JSON.stringify(itemInfo));
    window.alert(JSON.stringify(itemInfo));
  };
  return (
    <Wrapper>
      <p className="proto-title">Banner Test Page</p>
      <div className="proto-dummy">Dummy</div>
      <p className="proto-title">Single Banner</p>
      <EventBannerList list={singleBannerList} />
      <div className="proto-dummy">Dummy</div>
      <div className="proto-dummy">Dummy</div>
      <p className="proto-title">In-view Test(apply Wrapper BgColor)</p>
      <EventBannerList list={singleBannerList} bgColor="gray3" />
      <div className="proto-dummy">Dummy</div>
      <div className="proto-dummy">Dummy</div>
      <p className="proto-title">Multiple Banner - 프레스 효과 로직 처리</p>
      <EventBannerList list={bannerList} onClick={handleClick} />

      <div className="proto-dummy">Dummy</div>
    </Wrapper>
  );
};

export default ProtoBannerPage;

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
