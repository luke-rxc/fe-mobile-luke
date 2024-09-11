import env from '@env';
import { useCallback, useEffect } from 'react';

/**
 * AR 기술 검토 프로토타입
 *
 * @see {@link https://www.notion.so/rxc/AR-Web-4ab3977cc9204574a26f2adbecbd53bb?pvs=4}
 */
const ProtoARPage = () => {
  const arFileUrl =
    'https://developer.apple.com/augmented-reality/quick-look/models/nike-air-force/sneaker_airforce.usdz';
  const arThumbnailUrl =
    'https://developer.apple.com/augmented-reality/quick-look/models/nike-air-force/nike-air-force_2x.png';
  const bannerOption = {
    callToAction: '쇼핑백에 추가',
    checkoutTitle: 'Nike',
    checkoutSubTitle: 'Air Force',
    price: '180,000원',
  };
  const fragment = [
    '#callToAction=',
    bannerOption.callToAction,
    '&checkoutTitle=',
    bannerOption.checkoutTitle,
    '&checkoutSubtitle=',
    bannerOption.checkoutSubTitle,
    '&price=',
    bannerOption.price,
  ].join('');
  const arUrl = `${arFileUrl}${fragment}`;
  const navigateToGoodsPage = () => {
    window.location.href = `${env.endPoint.baseUrl}/bag/cart`;
  };
  const handleCallToAction = useCallback((event: MessageEventInit) => {
    if (event.data === '_apple_ar_quicklook_button_tapped') {
      navigateToGoodsPage();
    }
  }, []);
  useEffect(() => {
    const linkElement = document.getElementById('ar-link');
    linkElement?.addEventListener('message', handleCallToAction, false);
  }, [handleCallToAction]);
  return (
    <>
      <a id="ar-link" rel="ar" href={arUrl}>
        <img src={arThumbnailUrl} alt="ar-thumbnail" />
      </a>
    </>
  );
};

export default ProtoARPage;
