import styled from 'styled-components';
import classNames from 'classnames';
import { Button } from '@pui/button';
import { useEffect, useState } from 'react';
import { ReturnTypeUseContentEditable } from '../hooks';
import { UserChatInput } from './UserChatInput';
import { LiveActionType } from '../constants';

interface Props {
  className?: string;
  contentEditable: ReturnTypeUseContentEditable;
  inputFocused: boolean;
  // 구매인증 버튼 노출여부
  showPurchaseVerificationButton: boolean;
  horizontalRatioVideo: boolean;
  onClickUserAction: (path: LiveActionType) => (event: React.MouseEvent) => void;
}

export const ChatBlock = styled(
  ({
    className,
    contentEditable,
    inputFocused,
    showPurchaseVerificationButton,
    horizontalRatioVideo,
    onClickUserAction: handleClickUserAction,
  }: Props) => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [buttonHide, setButtonHide] = useState<boolean>(false);

    useEffect(() => {
      setTimeout(() => {
        setLoaded(inputFocused);
      }, 0);

      setTimeout(() => {
        setButtonHide(inputFocused);
      }, 100);
    }, [inputFocused]);

    if (!inputFocused) {
      return null;
    }

    return (
      <div className={classNames(className, { show: inputFocused })} onClick={contentEditable.handleBlur}>
        <ChatInnerBlock className={classNames({ focused: loaded })}>
          <UserChatInput
            className={classNames({
              'show-button': showPurchaseVerificationButton && !buttonHide,
              'full-width': buttonHide,
              'horizontal-ratio-video': horizontalRatioVideo,
            })}
            ref={contentEditable.inputRef}
            contentEditable={contentEditable}
          />
          <Button
            className={classNames('purchase-verification', { hide: !showPurchaseVerificationButton || buttonHide })}
            size="medium"
            variant="tertiaryfill"
            onClick={handleClickUserAction(LiveActionType.TAB_PURCHASE_VERIFICATION)}
          >
            구매인증
          </Button>
        </ChatInnerBlock>
      </div>
    );
  },
)`
  ${({ theme }) => theme.mixin.absolute({ l: 0, t: 0 })}
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 2;
  opacity: 0;
  pointer-events: none;

  &.show {
    opacity: 1;
    pointer-events: inherit;
  }
`;

const ChatInnerBlock = styled.div`
  display: flex;
  width: calc(100% - 8rem);
  height: 100%;
  align-items: end;
  padding: ${({ theme }) => theme.spacing.s16};
  ${({ theme }) => theme.mixin.safeArea('padding-bottom', 72)};
  transition: width 250ms 100ms;

  &.focused {
    width: 100%;
  }

  ${UserChatInput} {
    width: 100%;
    transition: width 250ms, flex-grow 250ms, flex-shrink 250ms;

    &.full-width {
      flex-grow: 0;
      flex-shrink: 0;
    }

    &.horizontal-ratio-video {
      background-color: ${({ theme }) => theme.light.color.gray20Dark};
    }
  }

  > button.purchase-verification {
    width: 7.3rem;
    margin-left: ${({ theme }) => theme.spacing.s8};
    font: ${({ theme }) => theme.fontType.smallB};
    color: ${({ theme }) => theme.light.color.white};
    background-color: ${({ theme }) => theme.light.color.gray50Light};
    transition: width 5s, margin-left 5s, visibility 0s 260ms;
    overflow: hidden;
    flex: 0 0 auto;

    span.button-content {
      white-space: nowrap;
    }

    &.hide {
      visibility: hidden;
    }
  }
`;
