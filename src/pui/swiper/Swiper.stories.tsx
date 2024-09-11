import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { Image, ImageProps } from '@pui/image';
import { SwiperContainer } from './SwiperContainer';
import { SwiperSlide } from './SwiperSlide';

export default {
  title: `${StoriesMenu.NonPDS}/Swiper`,
  component: SwiperContainer,
} as ComponentMeta<typeof SwiperContainer>;

const Template: ComponentStory<typeof SwiperContainer> = ({ ...args }) => (
  <div style={{ width: '400px' }}>
    <SwiperContainer {...args} />
  </div>
);

const list: ImageProps[] = Array(10)
  .fill(true)
  .map((_, idx) => {
    return {
      src: 'https://cdn-image.prizm.co.kr/story/20220714/8cc2b96b-90b4-4399-b5c5-8ecb4f017875.jpeg',
      blurHash: 'L58W~t?HMxsC00j]t7og?wI:o#S4',
    };
  });

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      {list.map((item: ImageProps, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <SwiperSlide key={idx}>
          <Image {...item} />
        </SwiperSlide>
      ))}
    </>
  ),
};

export const 스와이퍼_옵션변경 = Template.bind({});
스와이퍼_옵션변경.args = {
  onSwiper: (swiper: any) => console.log(swiper),
  onSlideChange: () => console.log('slide change'),
  slidesPerView: 3,
  slidesPerGroup: 3,
  spaceBetween: 10,
  loop: true,
  pagination: true,
  children: (
    <>
      {list.map((item: ImageProps, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <SwiperSlide key={idx}>
          <Image {...item} />
        </SwiperSlide>
      ))}
    </>
  ),
};

export const 컬러테마변경 = Template.bind({});
컬러테마변경.args = {
  onSwiper: (swiper: any) => console.log(swiper),
  onSlideChange: () => console.log('slide change'),
  pagination: true,
  controlTheme: {
    color: '#0000ff',
  },
  children: (
    <>
      {list.map((item: ImageProps, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <SwiperSlide key={idx}>
          <Image {...item} />
        </SwiperSlide>
      ))}
    </>
  ),
};

export const 인디케이터_오버레이 = Template.bind({});
인디케이터_오버레이.args = {
  onSwiper: (swiper: any) => console.log(swiper),
  onSlideChange: () => console.log('slide change'),
  pagination: true,
  controlTheme: {
    color: '#ff0000',
    paginationOverlay: 'white',
  },
  children: (
    <>
      {list.map((item: ImageProps, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <SwiperSlide key={idx}>
          <Image {...item} />
        </SwiperSlide>
      ))}
    </>
  ),
};
