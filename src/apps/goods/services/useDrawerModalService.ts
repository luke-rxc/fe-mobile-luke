import env from '@env';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useWebInterface } from '@hooks/useWebInterface';
import { getAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';
import { useDrawerModal } from '../hooks';
import { DrawerContainer } from '../containers/DrawerContainer';
import { GoodsDrawerType } from '../constants';

interface Props {
  goodsId: number;
  onLogTabPriceList: () => void;
}

export const useDrawerModalService = ({ goodsId, onLogTabPriceList: handleLogTabPriceList }: Props) => {
  const { isApp } = useDeviceDetect();
  const { handleDrawerOpen } = useDrawerModal();
  const { open } = useWebInterface();

  /** 요금표 모달 오픈 */
  const handlePriceListOpen = () => {
    handleLogTabPriceList();
    if (isApp) {
      const url = getAppLink(AppLinkTypes.WEB, {
        landingType: 'modal',
        url: `${env.endPoint.baseUrl}/goods/price-list/${goodsId}`,
      });
      open({ url, initialData: {} });
      return;
    }
    handleDrawerOpen(DrawerContainer, { type: GoodsDrawerType.PRICE_LIST, goodsId });
  };

  return {
    handlePriceListOpen,
  };
};
