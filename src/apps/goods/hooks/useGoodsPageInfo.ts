import { useLocation, useParams } from 'react-router-dom';
import { env } from '@env';
import { getAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';
import { goodsDecrypt } from '@utils/goodsEncrypt';

interface LocationStateParams {
  type: string;
  data: Record<string, unknown>;
}

const getId = (goodsPageId?: string) => {
  if (goodsPageId) {
    if (Number.isNaN(+goodsPageId)) {
      return goodsDecrypt(goodsPageId);
    }
    if (env.isDevelopment) {
      return { goodsId: +goodsPageId, showRoomId: 0 };
    }
  }

  return { goodsId: 0, showRoomId: 0 };
};

export const useGoodsPageInfo = () => {
  const { goodsPageId } = useParams<{ goodsPageId: string }>();
  const { goodsId, showRoomId } = getId(goodsPageId);
  const { pathname, state } = useLocation();
  const isInLivePage = pathname.includes('/goods/live');
  const deepLink = getAppLink(AppLinkTypes.GOODS, { goodsCode: goodsPageId });

  return {
    locationState: state as LocationStateParams,
    goodsPageId,
    goodsId,
    showRoomId,
    isInLivePage,
    deepLink,
  };
};
