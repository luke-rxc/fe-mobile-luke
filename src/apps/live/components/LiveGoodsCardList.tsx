import styled from 'styled-components';
import { LiveGoodsCardItem } from './LiveGoodsCardItem';
import { ReturnTypeUseLiveEndService } from '../services';

type Props = ReturnTypeUseLiveEndService['goodsListProps'];

export const LiveGoodsCardList = styled(
  ({ goodsList, handleImpressGoodsThumbnail, handleClickGoodsThumbnail, ...props }: Props) => {
    return (
      <div {...props}>
        {goodsList.map((item, index) => {
          return (
            <LiveGoodsCardItem
              key={`goods-${item.id}`}
              {...item}
              index={index + 1}
              onVisibility={handleImpressGoodsThumbnail}
              onClickGoods={handleClickGoodsThumbnail}
            />
          );
        })}
      </div>
    );
  },
)`
  & {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    overflow-x: auto;
    box-sizing: border-box;
    width: 100%;
    padding: ${({ theme }) => `0 ${theme.spacing.s24}`};
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }

  > div {
    flex: 0 0 auto;
    margin-left: ${({ theme }) => theme.spacing.s16};

    &:first-child {
      margin-left: 0;
    }
  }
`;
