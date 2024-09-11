import React from 'react';
import { useLink } from '@hooks/useLink';
import { List } from '@pui/list';
import { ListItemTitle } from '@pui/listItemTitle';
import { UniversalLinkTypes } from '@constants/link';

interface Props {
  goodsId: number;
  isInfoView: boolean;
  isQnaView: boolean;
  isGoodsKindTicket: boolean;
  onQnaClick: (evt: React.MouseEvent) => void;
  onCsClick: () => void;
  onInfoClick: () => void;
  onInfoTicketClick: () => void;
}

export const GoodsListItem: React.FC<Props> = ({
  goodsId,
  isInfoView,
  isQnaView,
  isGoodsKindTicket,
  onQnaClick: handleQnaTab,
  onCsClick: handleCsClick,
  onInfoClick: handleInfoClick,
  onInfoTicketClick: handleInfoTicketClick,
}) => {
  const { getLink } = useLink();
  const infoHref = getLink(UniversalLinkTypes.GOODS_INFO, { goodsId });
  const infoTicketHref = getLink(UniversalLinkTypes.GOODS_INFO_TICKET, { goodsId });

  return (
    <List>
      {!isGoodsKindTicket && (
        <ListItemTitle
          title="구매 배송/환불/교환 안내"
          link={getLink(UniversalLinkTypes.GOODS_CS, { goodsId })}
          onClickTitle={handleCsClick}
        />
      )}

      {/* 실물 상품일 경우 */}
      {isInfoView && !isGoodsKindTicket && (
        <ListItemTitle title="상품고시/판매자 정보" link={infoHref} onClickTitle={handleInfoClick} />
      )}

      {/* 티켓 상품일 경우 */}
      {isGoodsKindTicket && (
        <ListItemTitle title="상품고시/환불/취소 안내" link={infoTicketHref} onClickTitle={handleInfoTicketClick} />
      )}

      {isQnaView && <ListItemTitle title="1:1 문의" onClickTitle={handleQnaTab} />}
    </List>
  );
};
