import { useHistory } from 'react-router-dom';
import type { UniversalLinkTypes } from '@constants/link';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { getUniversalLink, GetLinkParams } from '@utils/link';

export const useLink = () => {
  const history = useHistory();
  const { isApp } = useDeviceDetect();

  /**
   * Device에 의한 범용 Link 반환
   *
   * @example
   *   getLink('STORY', { storyCode: 1 });
   *   getLink('STORY', { storyCode: 1 }, { query: { foo: 'bar' } });
   *   getLink(UniversalLinkTypes.STORY, { storyCode: 1 });
   *   getLink(UniversalLinkTypes.STORY, { storyCode: 1 }, { query: { foo: 'bar' } });
   */
  const getLink: GetLinkParams<UniversalLinkTypes> = (...args) => {
    return matchLink(getUniversalLink(...args));
  };

  /**
   * 전달된 URL 중 Dectect를 통해 매칭되는 Device의 URL을 반환
   *
   * @example
   *   matchLink({ web: 'https://prizm.co.kr', app: 'prizm://prizm.co.kr' })
   */
  const matchLink = ({ web, app }: { web: string; app: string }) => {
    return isApp ? app : web;
  };

  /**
   * 링크 연결
   * - Web 이라면 history push
   * - App 이라면 location 이동
   * - 무조건 location 모드 부분도 param 으로 등록
   */
  const toLink = (link: string, onlyLocation = false) => {
    if (onlyLocation || isApp) {
      window.location.href = link;
      return;
    }

    history.push(link);
  };

  return {
    getLink,
    matchLink,
    toLink,
  };
};
