import isEmpty from 'lodash/isEmpty';
import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import { Navigation as NavigationComponent } from '@pui/navigation';
import { useLogService } from '@features/landmark/services/useLogService';
import { useNavigationState, useNavigationDispatch } from '../../hooks/useNavigation';
import { useNewNoticeCount } from '../../services/useNewNoticeCount';
import { useNewCartCount } from '../../services/useNewCartCount';

const getUserInfo = (auth: ReturnType<typeof useAuth>) => {
  if (!auth?.userInfo) {
    return undefined;
  }

  const { nickname, profileImage } = auth.userInfo;

  return {
    nickname,
    profileImage: profileImage.path,
  };
};

/**
 * Landmark Navigation
 */
export const Navigation = () => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const auth = useAuth();
  const state = useNavigationState();
  const dispatch = useNavigationDispatch();
  const userInfo = useMemo(() => getUserInfo(auth), [auth]);
  const { logClickNavigation: handleClickNavigation } = useLogService();

  const { count: notiCount } = useNewNoticeCount({ enabled: auth?.isLogin });
  const { count: cartCount } = useNewCartCount({ enabled: auth?.isLogin });

  const handleClose = () => {
    dispatch.merge({ open: false });
  };

  const handleTransitionStart = (open: boolean) => {
    dispatch.merge({ status: open ? 'opening' : 'closing' });
  };

  const handleTransitionEnd = (open: boolean) => {
    dispatch.merge({ status: open ? 'opened' : 'closed' });
  };

  useEffect(() => {
    element && dispatch.merge({ element });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, element]);

  useEffect(() => {
    dispatch.merge({ notiCount, cartCount });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notiCount, cartCount]);

  if (isEmpty(state) || !state.enabled) {
    return null;
  }

  return (
    <NavigationComponent
      ref={(el) => setElement(el)}
      open={state.open}
      userInfo={userInfo}
      notiCount={notiCount}
      cartCount={cartCount}
      onClose={handleClose}
      onTransitionStart={handleTransitionStart}
      onTransitionEnd={handleTransitionEnd}
      onClickTitle={handleClickNavigation}
    />
  );
};
