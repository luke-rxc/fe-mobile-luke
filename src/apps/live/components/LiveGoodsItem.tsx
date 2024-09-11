import styled from 'styled-components';
import { GoodsListItem } from '@pui/goodsListItem';
import { PrizmOnlyTagProps } from '@pui/prizmOnlyTag';
import { LiveGoodsModel } from '../models';
import { ReturnTypeUseLiveLogService } from '../services/useLogService';

interface Props {
  item: LiveGoodsModel;
  prizmOnlyTagOption?: Partial<PrizmOnlyTagProps>;
  onLogLiveTabGoods: ReturnTypeUseLiveLogService['logLiveTabGoods'];
}

export const LiveGoodsItem = ({
  item: { brand, goods },
  prizmOnlyTagOption,
  onLogLiveTabGoods: handleLogLiveTabGoods,
}: Props) => {
  const handleClick = () => {
    handleLogLiveTabGoods({
      goodsId: goods.id.toString(),
      goodsName: goods.name,
      goodsType: goods.type,
    });
  };

  const image = {
    src: goods.primaryImage.path,
    lazy: true,
    blurHash: goods.primaryImage.blurHash,
  };

  return (
    <GoodsCardRowWrapperStyled className="goods">
      <GoodsListItem
        image={image}
        goodsName={goods.name}
        discountRate={goods.discountRate}
        price={goods.price}
        brandName={brand ? brand.name : ''}
        goodsCode={goods.code}
        tagType={goods.benefits?.tagType}
        prizmOnlyTagOption={prizmOnlyTagOption}
        hasCoupon={goods.hasCoupon}
        benefitLabel={goods.benefits?.label || ''}
        runOut={goods.isRunout}
        onClick={handleClick}
      />
    </GoodsCardRowWrapperStyled>
  );
};

const GoodsCardRowWrapperStyled = styled.div`
  padding: 0 !important;
`;
