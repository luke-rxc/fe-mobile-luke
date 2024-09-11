import { GoodsList, GoodsListProps } from '@pui/goodsList';
import { TitleSection } from '@pui/titleSection';

interface GoodsHistoryProps extends GoodsListProps {
  className?: string;
}

export const GoodsHistory = ({ className, ...props }: GoodsHistoryProps) => {
  const { goodsList } = props;

  if (goodsList.length < 1) {
    return null;
  }

  return (
    <div className={className}>
      <TitleSection title="최근 본 상품" />
      <GoodsList {...props} />
    </div>
  );
};
