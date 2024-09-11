import { useEffect } from 'react';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { useAuth } from '@hooks/useAuth';
import styled from 'styled-components';
import { useLoading } from '@hooks/useLoading';
import { ListItemButton } from '@pui/listItemButton';
import { Divider } from '@pui/divider';
import { TitleSection } from '@pui/titleSection';
import { Clipboard } from '@pui/icon';
import { useAccountService } from '../services';
import { AccountTitle } from '../constants';
import { AccountListItemsForm, DeleteUser } from '../components';

export const AccountContainer = () => {
  const { userInfo } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const {
    isConnecting,
    isLoading,
    isCheckedKakao,
    isCheckedApple,
    handleClickEmail,
    handleConnectSocial,
    handleUnconnectSocial,
    handleWithdraw,
  } = useAccountService();

  useHeaderDispatch({
    type: 'mweb',
    enabled: true,
    title: '계정 정보',
    quickMenus: ['cart', 'menu'],
  });

  const { email } = userInfo ?? {};

  const handleConnect = (type: string, isChecked: boolean) => {
    if (isConnecting.current) return;
    if (!isChecked) {
      handleConnectSocial(type);
    } else {
      handleUnconnectSocial(type);
    }
  };

  /**
   * 로딩바 처리
   */
  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  /** Loading 처리 */
  if (isLoading) {
    return null;
  }

  return (
    <WrapperStyled>
      {/* 이메일 */}
      <TitleSection title={AccountTitle.EMAIL} />
      <ListItemButton
        is="div"
        title={email ?? ''}
        onClick={() => handleClickEmail(email ?? '')}
        suffix={
          <>
            <Clipboard size="1.8rem" />
            복사
          </>
        }
      />
      <Divider />

      {/* 연결된 계정 */}
      <AccountListItemsForm
        isCheckedKakao={isCheckedKakao}
        isCheckedApple={isCheckedApple}
        onChangeSwitch={handleConnect}
        loginType={userInfo?.loginType}
      />

      {/* 회원탈퇴 버튼 */}
      <DeleteUser onClick={handleWithdraw} />
    </WrapperStyled>
  );
};
const WrapperStyled = styled.div`
  position: relative;
  padding-bottom: 4.8rem;

  ${Divider} {
    margin: ${({ theme }) => `${theme.spacing.s12} 0`};
  }
`;
