import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { AppleFilled, KakaoFilled } from '@pui/icon';
import { SwitchListItem } from '@pui/switchListItem';
import { TitleSub } from '@pui/titleSub';
import styled from 'styled-components';
import { LoginType } from '@schemas/userSchema';
import { AccountTitle } from '../constants';

export interface AccountListItemsProps {
  isCheckedKakao: boolean;
  isCheckedApple: boolean;
  loginType?: LoginType;
  onChangeSwitch: (type: string, isChecked: boolean) => void;
}

export const AccountListItemsForm = ({
  isCheckedKakao,
  isCheckedApple,
  loginType,
  onChangeSwitch: handleChangeSwitch,
}: AccountListItemsProps) => {
  const { isIOS } = useDeviceDetect();

  return (
    <ConnectAccountListStyled>
      <TitleSub title={AccountTitle.CONNECT_ACCOUNT} />
      <SwitchListItem
        prefix={<KakaoFilled />}
        text={AccountTitle.KAKAO}
        onChangeSwitch={() => handleChangeSwitch('KAKAO', isCheckedKakao)}
        checked={isCheckedKakao}
        disabled={loginType === 'KAKAO'}
      />
      {isIOS && (
        <SwitchListItem
          prefix={<AppleFilled />}
          text={AccountTitle.APPLE}
          onChangeSwitch={() => handleChangeSwitch('APPLE', isCheckedApple)}
          checked={isCheckedApple}
          disabled={loginType === 'APPLE'}
        />
      )}
    </ConnectAccountListStyled>
  );
};
const ConnectAccountListStyled = styled.div`
  margin-top: 1.2rem;
`;
