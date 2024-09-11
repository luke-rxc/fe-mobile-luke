import { useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import { FormProvider } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { LoginContent } from '@features/login/components';
import { useRedirectUrl } from '@features/login/hooks';
import { useMemberLoginService } from '../services';
import { PAGE_LOAD_TYPE } from '../types';

export const MemberLoginContainer = () => {
  const { isLogin } = useAuth();
  const { redirectUrl } = useRedirectUrl();
  const history = useHistory();
  const { pageLoad, method, banners, onSubmit, handleSocial } = useMemberLoginService();

  useHeaderDispatch({
    type: 'mweb',
    enabled: true,
    quickMenus: ['cart', 'menu'],
    overlay: true,
  });

  useEffect(() => {
    if (isLogin) {
      history.replace(redirectUrl || '/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, history]);

  if (isLogin) {
    return null;
  }

  if (pageLoad === PAGE_LOAD_TYPE.LOADING) {
    return null;
  }

  return (
    <FormProvider {...method}>
      <LoginContent banners={banners} onSubmit={onSubmit} onSocial={handleSocial} />
    </FormProvider>
  );
};
