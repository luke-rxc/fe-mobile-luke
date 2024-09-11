import { useAuth } from '@hooks/useAuth';
import { useWebInterface } from '@hooks/useWebInterface';
import { useLink } from '@hooks/useLink';
import { UniversalLinkTypes } from '@constants/link';
import { useGoodsPageInfo } from '../hooks';

interface Props {
  onLogTabQnA: (goodsId: number) => void;
}

export const useLinkService = ({ onLogTabQnA }: Props) => {
  const { getIsLogin } = useAuth();
  const { signIn } = useWebInterface();
  const { toLink, getLink } = useLink();
  const { goodsId } = useGoodsPageInfo();

  /**
   * 상품 문의
   */
  const handleQnaLink = (evt: React.MouseEvent) => {
    onLogTabQnA?.(goodsId);
    evt.preventDefault();

    toQnaLink();
  };

  /**
   * mWeb v1
   */
  const toQnaLink = async () => {
    const link = getLink(UniversalLinkTypes.CS_QNA_REGISTER_GOODS, { goodsId });

    if (!getIsLogin() && !(await signIn())) {
      return;
    }

    toLink(link);
  };

  /**
   * 쿠폰함 이동
   */
  const handleCouponLink = () => {
    toLink(getLink(UniversalLinkTypes.COUPON));
  };

  return {
    handleCouponLink,
    handleQnaLink,
  };
};
