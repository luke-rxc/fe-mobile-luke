import styled from 'styled-components';
import { useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { TitleSection } from '@pui/titleSection';
import { Tabs } from '@pui/tabs';
import { GoodsList } from '@pui/goodsList';
import { GoodsCardProps } from '@pui/goodsCard';
import { Sticky } from '@features/landmark/components/sticky/Sticky';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';

const ProtoStickyPage = styled(({ className }) => {
  const sub1 = useRef<HTMLDivElement>(null);
  const sub2 = useRef<HTMLDivElement>(null);
  const goodsList = useMemo(getGoodsMock, []);

  useHeaderDispatch({
    type: 'mweb',
    title: 'ProtoSticky',
    enabled: true,
    quickMenus: ['cart', 'menu'],
  });

  return (
    <div className={className}>
      <Sticky wasSticky>
        <Tabs
          type="bubble"
          data={new Array(10).fill('Tab').map((v, i) => `${v}-${i + 1}`)}
          defaultValue={1}
          className={`${className} is-portal`}
        />
      </Sticky>

      <TitleSection title="ProtoSticky" className={`${className} is-portal`} />
      <GoodsList goodsList={goodsList} />

      <Sticky>
        <TitleSection title="ProtoSticky Sub Title1" className={`${className} is-portal`} />
      </Sticky>
      <GoodsList ref={sub1} goodsList={goodsList} />

      <Sticky>
        <TitleSection title="ProtoSticky Sub Title2" className={`${className} is-portal`} />
      </Sticky>
      <GoodsList ref={sub2} goodsList={goodsList} />

      <Sticky disabled>
        {({ stickable }) => <TitleSection title={`Not Sticky ${stickable ? 'stickable' : ''}`} />}
      </Sticky>
      <GoodsList goodsList={goodsList} />
    </div>
  );
})``;

const getGoodsMock = () => {
  return Array(10)
    .fill(true)
    .map<GoodsCardProps>((_, idx) => {
      return {
        goodsId: idx + 1,
        goodsCode: `jj5yidd${uuid()}`,
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
};

export default ProtoStickyPage;
