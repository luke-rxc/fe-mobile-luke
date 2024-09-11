import { AppLinkTypes, WebLinkTypes, UniversalLinkTypes, ContentLinkTypes } from '@constants/link';
import { getAppLink, getWebLink, getUniversalLink } from '@utils/link';
import { useLink } from '@hooks/useLink';

const ProtoLinkPage = () => {
  const { getLink, matchLink } = useLink();

  return (
    <>
      <h2>AppLink</h2>
      <p>{getAppLink('GOODS_DETAIL', { goodsId: 123 })}</p>
      <p>{getAppLink(AppLinkTypes.GOODS_DETAIL, { goodsId: 123 })}</p>
      <h2>WebLink</h2>
      <p>{getWebLink('GOODS', { goodsPageId: 123 })}</p>
      <p>{getWebLink(WebLinkTypes.GOODS, { goodsPageId: 123 })}</p>
      <p>{getWebLink('CONTENT', { contentType: ContentLinkTypes.STORY, contentCode: 123 })}</p>
      <p>{getWebLink(WebLinkTypes.CONTENT, { contentType: ContentLinkTypes.STORY, contentCode: 123 })}</p>
      <h2>UniversalLink</h2>
      <p>{JSON.stringify(getUniversalLink('LIVE', { liveId: 111 }))}</p>
      <p>{JSON.stringify(getUniversalLink(UniversalLinkTypes.LIVE, { liveId: 111 }))}</p>
      <h2>useLink</h2>
      <p>{getLink('CART')}</p>
      <p>{getLink('CS_QNA_LIST')}</p>
      <p>{getLink('CS_QNA_DETAIL', { requestId: 2 })}</p>
      <p>{matchLink({ web: 'https://prizm.co.kr', app: 'prizm://prizm.co.kr' })}</p>
    </>
  );
};

export default ProtoLinkPage;
