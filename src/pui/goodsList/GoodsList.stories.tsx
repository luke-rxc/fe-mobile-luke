import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StoriesMenu } from '@stories/menu';
import { useCallback, useRef, useState } from 'react';
import { uid } from '@utils/nanoid';
import { useWebInterface } from '@hooks/useWebInterface';
import { WebInterfaceProvider } from '@contexts/WebInterfaceContext';
import { GoodsCardProps, GoodsCardWishChangeParams } from '@pui/goodsCard';
import { GoodsList } from './GoodsList';

export default {
  title: `${StoriesMenu.PDS.DataDisplayCardType}/Goods/GoodsList`,
  component: GoodsList,
  decorators: [
    (Story) => {
      return (
        <WebInterfaceProvider>
          <Story />
        </WebInterfaceProvider>
      );
    },
  ],
} as ComponentMeta<typeof GoodsList>;

const Template: ComponentStory<typeof GoodsList> = ({ ...args }, { parameters }) => {
  const { isWishAble } = parameters ?? {};
  const getMock = useCallback(() => {
    return new Array(10).fill(true).map<GoodsCardProps>((_, idx): GoodsCardProps => {
      return {
        goodsId: idx + 1,
        goodsCode: `jj5yidd${uid()}`,
        image: {
          src: 'https://cdn-image.prizm.co.kr/goods/20220721/4f22d2a2-f860-46fe-8d4b-311e492674ba.jpeg?im=Resize,width=192',
          lazy: true,
          blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
        },
        goodsName:
          '[단독]_루미르4E 테이블 램프 카멜오렌지루미르4E 테이블 램프 카멜오렌지루미르4E 테이블 램프 카멜오렌지',
        price: 3000,
        discountRate: 0,
        brandImageUrl: 'https://cdn-image.prizm.co.kr/brand/20220713/b91857b5-28c0-4cf4-ab09-5db031138c6a.svg',
        wish: isWishAble ? { wished: !!Math.round(Math.random() * 1), wishedMotion: false, showRoomId: 0 } : undefined,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [items, setItems] = useState<GoodsCardProps[]>(getMock());
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const count = useRef<number>(0);
  const { emitWishItemUpdated } = useWebInterface();

  const requestData = (ms: number): Promise<GoodsCardProps[]> => {
    return new Promise((resolve) =>
      setTimeout(() => {
        const mock = getMock();
        resolve(mock);
      }, ms),
    );
  };

  const handleLoadMore = async () => {
    count.current += 1;

    if (count.current === 3) {
      setDisabled(true);
      return;
    }

    setIsLoading(true);
    setDisabled(true);
    const resData = await requestData(1000);
    setItems([...items, ...resData]);
    setIsLoading(false);
    setDisabled(false);
  };

  const handleChangeWish = (params: GoodsCardWishChangeParams) => {
    const { goodsId, goodsCode, wished } = params;
    args?.onChangeWish(params);
    emitWishItemUpdated({
      goodsId,
      goodsCode,
      isAdded: !wished,
    });
  };

  return (
    <div style={{ width: '360px' }}>
      <GoodsList
        {...args}
        onChangeWish={handleChangeWish}
        goodsList={items}
        isLoading={isLoading}
        disabled={disabled}
        onScrolled={handleLoadMore}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};

const Template2: ComponentStory<typeof GoodsList> = ({ ...args }) => {
  const getMock = useCallback(() => {
    return new Array(10).fill(true).map<GoodsCardProps>((_, idx): GoodsCardProps => {
      return {
        goodsId: idx + 1,
        goodsCode: `jj5yidd${uid()}`,
        image: {
          src: 'https://cdn-image.prizm.co.kr/goods/20220721/4f22d2a2-f860-46fe-8d4b-311e492674ba.jpeg?im=Resize,width=192',
          lazy: true,
          blurHash: 'UCHB3jOZ00Vs}lE2R.R*iw?FNIIo00D%yD%g',
        },
        goodsName:
          '[단독]_루미르4E 테이블 램프 카멜오렌지루미르4E 테이블 램프 카멜오렌지루미르4E 테이블 램프 카멜오렌지',
        price: 3000,
        discountRate: 0,
        brandImageUrl: 'https://cdn-image.prizm.co.kr/brand/20220713/b91857b5-28c0-4cf4-ab09-5db031138c6a.svg',
      };
    });
  }, []);

  const [items] = useState<GoodsCardProps[]>(getMock());

  return (
    <div style={{ width: '360px' }}>
      <GoodsList {...args} goodsList={items} />
    </div>
  );
};
export const InfiniteScroll비활성 = Template2.bind({});
InfiniteScroll비활성.args = {
  disabled: true,
};

export const WishList = Template.bind({});
WishList.args = {
  onChangeWish: ({ goodsId, goodsCode, wished }: GoodsCardWishChangeParams) => {
    alert(`
    api 통신 이후 emitWishItemUpdated 로 갱신
    goodsId: ${goodsId}
    goodsCode: ${goodsCode}
    위시체크여부: ${wished}
  `);
  },
};

WishList.parameters = {
  isWishAble: true,
};
