import { WebLinkTypes } from '@constants/link';
import { useFooterDispatch } from '@features/landmark/hooks/useFooter';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useAuth } from '@hooks/useAuth';
import { getWebLink } from '@utils/link';
import { useHistory } from 'react-router-dom';
import { SettingList } from '../components';
import { SettingTitle } from '../constants';
import { useSettingService } from '../services';
import { ListType } from '../types';

export const SettingContainer = () => {
  const history = useHistory();
  const { isLogin } = useAuth();
  const { handleLogin, handleLogout } = useSettingService();
  const loginList: ListType[] = [
    {
      title: SettingTitle.PROFILE,
      url: getWebLink(WebLinkTypes.PROFILE),
    },
    {
      title: SettingTitle.ACCOUNT_INFO,
      url: getWebLink(WebLinkTypes.MYPAGE_ACCOUNT),
    },
    {
      title: SettingTitle.LOGOUT,
    },
  ];
  const logoutList: ListType[] = [
    {
      title: SettingTitle.LOGIN,
    },
  ];
  useHeaderDispatch({
    type: 'mweb',
    enabled: true,
    title: '설정',
    quickMenus: ['cart', 'menu'],
  });
  useFooterDispatch({
    enabled: true,
    hideLinks: true,
  });

  const handleClick = (value: ListType) => {
    const { title, url } = value;

    if (title === SettingTitle.LOGIN) {
      handleLogin();
    } else if (title === SettingTitle.LOGOUT) {
      handleLogout();
    } else {
      url && history.push(url);
    }
  };
  return <SettingList title={SettingTitle.ACCOUNT} list={isLogin ? loginList : logoutList} onClick={handleClick} />;
};
