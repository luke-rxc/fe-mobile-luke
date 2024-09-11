import { ComponentStory, ComponentMeta } from '@storybook/react';
import styled from 'styled-components';
import { LiveGoodsImages } from './LiveGoodsImages';

export default {
  title: 'Features/Live/LiveGoodsImages',
  component: LiveGoodsImages,
} as ComponentMeta<typeof LiveGoodsImages>;

const Template: ComponentStory<typeof LiveGoodsImages> = (args) => {
  return (
    <WrapperStyled>
      <LiveGoodsImages {...args} />
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  width: 6.4rem;
`;

export const Default = Template.bind({});
Default.args = {
  images: [
    {
      blurHash: 'UyCa*_i]I9WXyZjDjDayW@oet7V@Sja|tRax',
      height: 20,
      id: 104,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/67a31399-e6aa-4353-8ab8-cf155d6ea343',
      width: 10,
    },
  ],
};

export const 썸네일이미지2장 = Template.bind({});
썸네일이미지2장.args = {
  images: [
    {
      blurHash: 'UyCa*_i]I9WXyZjDjDayW@oet7V@Sja|tRax',
      height: 20,
      id: 104,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/67a31399-e6aa-4353-8ab8-cf155d6ea343',
      width: 10,
    },
    {
      blurHash: '',
      height: 20,
      id: 107,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/09316356-ba34-4d8f-9295-4b90826dfae7',
      width: 10,
    },
  ],
};

export const 썸네일이미지3장 = Template.bind({});
썸네일이미지3장.args = {
  images: [
    {
      blurHash: 'UyCa*_i]I9WXyZjDjDayW@oet7V@Sja|tRax',
      height: 20,
      id: 104,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/67a31399-e6aa-4353-8ab8-cf155d6ea343',
      width: 10,
    },
    {
      blurHash: '',
      height: 20,
      id: 107,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/09316356-ba34-4d8f-9295-4b90826dfae7',
      width: 10,
    },
    {
      blurHash: '',
      height: 20,
      id: 108,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/6ae09d87-f8d7-4496-95c6-40859fd9845c',
      width: 10,
    },
  ],
};

export const 썸네일이미지4장 = Template.bind({});
썸네일이미지4장.args = {
  images: [
    {
      blurHash: 'UyCa*_i]I9WXyZjDjDayW@oet7V@Sja|tRax',
      height: 20,
      id: 104,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/67a31399-e6aa-4353-8ab8-cf155d6ea343',
      width: 10,
    },
    {
      blurHash: '',
      height: 20,
      id: 107,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/09316356-ba34-4d8f-9295-4b90826dfae7',
      width: 10,
    },
    {
      blurHash: '',
      height: 20,
      id: 108,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/6ae09d87-f8d7-4496-95c6-40859fd9845c',
      width: 10,
    },
    {
      blurHash: '',
      height: 20,
      id: 101,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/ef568a7d-e1f2-4c3f-806d-cd192d9da742',
      width: 10,
    },
  ],
};

export const 썸네일이미지4장이상 = Template.bind({});
썸네일이미지4장이상.args = {
  images: [
    {
      blurHash: 'UyCa*_i]I9WXyZjDjDayW@oet7V@Sja|tRax',
      height: 20,
      id: 104,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/67a31399-e6aa-4353-8ab8-cf155d6ea343',
      width: 10,
    },
    {
      blurHash: '',
      height: 20,
      id: 107,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/09316356-ba34-4d8f-9295-4b90826dfae7',
      width: 10,
    },
    {
      blurHash: '',
      height: 20,
      id: 108,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/6ae09d87-f8d7-4496-95c6-40859fd9845c',
      width: 10,
    },
    {
      blurHash: '',
      height: 20,
      id: 101,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/ef568a7d-e1f2-4c3f-806d-cd192d9da742',
      width: 10,
    },
    {
      blurHash: '',
      height: 20,
      id: 102,
      path: 'https://cdn-dev.prizm.co.kr/goods/20210701/ef568a7d-e1f2-4c3f-806d-cd192d9da742',
      width: 10,
    },
  ],
};
