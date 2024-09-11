import styled from 'styled-components';
import { Button } from '@pui/button';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { createDebug } from '@utils/debug';
import { ActionButtonType, LiveActionType } from '../constants';
import { SendBirdUserInfo } from '../types';
import { UserChatView } from './UserChatView';

interface Props {
  fullWidth: boolean;
  buttonLabel: string;
  sendbirdUser: SendBirdUserInfo;
  inputFocused: boolean;
  chatMessage: string;
  showPurchaseVerificationButton: boolean;
  activeViewType: ActionButtonType | undefined;
  horizontalRatioVideo: boolean;
  onClickUserAction: (path: LiveActionType) => (event?: React.MouseEvent | undefined) => void;
  onFocus: () => void;
  onBlur: () => void;
  onLogLiveImpressionPurchaseVerification: () => void;
}

const debug = createDebug();

export const ChatArea = ({
  fullWidth,
  buttonLabel,
  sendbirdUser: { login, profileImagePath },
  inputFocused,
  chatMessage,
  showPurchaseVerificationButton,
  activeViewType,
  horizontalRatioVideo,
  onClickUserAction,
  onFocus,
  onBlur,
  onLogLiveImpressionPurchaseVerification,
}: Props) => {
  const [exposed, setExposed] = useState<boolean>(false);

  useEffect(() => {
    if (!exposed && showPurchaseVerificationButton && activeViewType === ActionButtonType.CHAT) {
      setTimeout(() => {
        debug.info('구매인증 버튼 노출처리: true');
        onLogLiveImpressionPurchaseVerification();
        setExposed(true);
      }, 1000);
    } else if (exposed && !showPurchaseVerificationButton) {
      debug.info('구매인증 버튼 노출처리: false');
      setExposed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeViewType, exposed, showPurchaseVerificationButton]);

  if (login) {
    return (
      <WrapperStyled $fullWidth={fullWidth} $hide={inputFocused} $horizontalRatioVideo={horizontalRatioVideo}>
        <UserChatView
          profileUrl={profileImagePath}
          chatMessage={chatMessage}
          onBlur={onBlur}
          onFocus={onFocus}
          className={classNames({ 'show-button': exposed })}
        />
        {!inputFocused && (
          <Button
            block
            className={classNames('purchase-verification', { hide: !exposed })}
            size="medium"
            variant="tertiaryfill"
            onClick={onClickUserAction(LiveActionType.TAB_PURCHASE_VERIFICATION)}
          >
            구매인증
          </Button>
        )}
      </WrapperStyled>
    );
  }

  const onClickAction = () => {
    const openApp = onClickUserAction(LiveActionType.LIVE_CHAT);
    openApp();
  };

  return (
    <WrapperStyled $fullWidth={fullWidth} $horizontalRatioVideo={horizontalRatioVideo}>
      <Button className="default" block size="medium" variant="tertiaryfill" onClick={onClickAction}>
        {buttonLabel}
      </Button>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div<{ $fullWidth: boolean; $hide?: boolean; $horizontalRatioVideo: boolean }>`
  display: flex;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'calc(100% - 8rem)')};
  padding: ${({ theme }) => `${theme.spacing.s16} 0`};
  box-sizing: border-box;
  transition: width 0.25s;
  overflow: hidden;
  pointer-events: auto;

  > button.default {
    background-color: ${({ theme, $horizontalRatioVideo }) =>
      $horizontalRatioVideo ? theme.light.color.gray20Dark : theme.light.color.gray50Light};
    color: ${({ theme }) => theme.light.color.gray50Dark};
    border-radius: ${({ theme }) => theme.radius.r8} !important;
  }

  ${UserChatView} {
    background-color: ${({ theme, $horizontalRatioVideo }) =>
      $horizontalRatioVideo ? theme.light.color.gray20Dark : theme.light.color.gray50Light};
    transition: width 250ms, flex-grow 250ms, flex-shrink 250ms;

    flex: 0 0 auto;
  }

  > button.purchase-verification {
    width: 7.3rem;
    font: ${({ theme }) => theme.fontType.smallB};
    color: ${({ theme }) => theme.light.color.white};
    background-color: ${({ theme, $horizontalRatioVideo }) =>
      $horizontalRatioVideo ? theme.light.color.gray20Dark : theme.light.color.gray50Light};
    transition: width 0.25s, margin-left 0.25s;
    margin-left: ${({ theme }) => theme.spacing.s8};
    overflow: hidden;
    flex: 0 0 auto;

    span.button-content {
      white-space: nowrap;
    }
  }

  ${({ $hide }) =>
    $hide &&
    `
    visibility: hidden
  `}
`;
