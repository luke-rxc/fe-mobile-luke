import { useState, useMemo } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { GoodsList } from './GoodsList';
import reference from './ContentList.stories';

const createGoods = (id: number) => ({
  goodsId: id + 1,
  goodsCode: `jj5yidd${id}`,
  image: {
    src: 'https://cdn-image.prizm.co.kr/goods/20220721/4f22d2a2-f860-46fe-8d4b-311e492674ba.jpeg?im=Resize,width=192',
    lazy: true,
    blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
  },
  goodsName: '[단독]_루미르4E 테이블 램프 카멜오렌지루미르4E 테이블 램프 카멜오렌지루미르4E 테이블 램프 카멜오렌지',
  price: 3000,
  discountRate: 0,
  brandImageUrl: 'https://cdn-image.prizm.co.kr/brand/20220713/b91857b5-28c0-4cf4-ab09-5db031138c6a.svg',
});

export default {
  title: `${StoriesMenu.Apps}/Showroom/components/GoodsList`,
  component: GoodsList,
  parameters: {
    design: reference.parameters?.design,
  },
} as ComponentMeta<typeof GoodsList>;

const Template: ComponentStory<typeof GoodsList> = ({ ...args }) => <GoodsList {...args} />;

export const 상품O = Template.bind({});
상품O.args = {
  goods: [createGoods(1), createGoods(2), createGoods(3)],
};

export const 상품X = Template.bind({});
상품X.args = {};

const LoadMoreTemplate: ComponentStory<typeof GoodsList> = ({ onLoadMore, ...args }) => {
  const [count, setCount] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const goods = useMemo(() => new Array(count * 20).fill(0).map((_, i) => createGoods(i)), [count]);

  const handleLoadMore = () => {
    setLoading(true);
    onLoadMore?.();

    setTimeout(() => {
      setCount((prev) => prev + 1);
      setLoading(false);
    }, 500);
  };

  return <GoodsList {...args} goods={goods} loading={isLoading} onLoadMore={handleLoadMore} />;
};

export const 상품_추가_로드 = LoadMoreTemplate.bind({});
상품_추가_로드.args = {
  hasMore: true,
};
