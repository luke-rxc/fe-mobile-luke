import React, { forwardRef, useCallback, useState, useEffect, useRef } from 'react';
import type { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useAuth } from '@hooks/useAuth';
import { Action } from '@pui/action';
import { Button } from '@pui/button';
import { SendFilled } from '@pui/icon';
import { ProfilesProps, Profiles } from '@pui/profiles';
import { TextField as TextFieldComponent } from '@pui/textfield';
import nl2br from '@utils/nl2br';
import { REPLY_INPUT_GUIDE } from '../../../constants';
import { useContentStoreService, usePresetReplyInputService } from '../../../services';
import { useContentStore } from '../../../stores';

export type ReplyInputProps = HTMLAttributes<HTMLDivElement> & {
  handleResetList: () => void;
  /** TODO: 수정기능 추가 */
  replyId?: number | null;
  textValue?: string;
  onFocus?: () => void;
  onBlur?: () => void;
};

const ReplyInputComponent = forwardRef<HTMLDivElement, ReplyInputProps>(
  ({ className, replyId, textValue, handleResetList, onFocus, onBlur, ...props }, ref) => {
    const contentInfo = useContentStore.use.contentInfo();
    const { userInfo, isLogin } = useAuth();
    const { handleSignIn } = useContentStoreService();
    const { method, isLoading, handleRegisterReply } = usePresetReplyInputService({
      code: contentInfo.code,
    });
    const { handleSubmit: handleFormSubmit, setValue } = method;
    const textField = useRef<HTMLInputElement | null>(null);
    const focusState = useRef<boolean>(false);
    const [isMultiLine, setIsMultiLine] = useState<boolean>(false);
    const [textFullViewStatus, setTextFullViewStatus] = useState<{
      /** 텍스트 박스 full 노출시 */
      fullIn: boolean;
      /** 프로필 / 텍스트 박스 동시 노출시 */
      fullOut: boolean;
    }>({
      fullIn: false,
      fullOut: false,
    });
    const [submitButtonStatus, setSubmitButtonStatus] = useState<{
      /** 전송버튼 숨김 */
      hidden: boolean;
      /** 전송버튼 비활성화 */
      disabled: boolean;
    }>({
      hidden: true,
      disabled: true,
    });
    const [profileData, setProfileData] = useState<ProfilesProps | null>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const [guideMessage, setGuideMessage] = useState<string>(REPLY_INPUT_GUIDE);

    const handleLogin = async () => {
      const signInResult = await handleSignIn();
      if (signInResult) {
        handleResetList();
      }
    };

    const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { offsetHeight, textContent } = e.currentTarget;
      setIsMultiLine(offsetHeight > 50); // 한 줄 높이 넘어가는 경우
      setSubmitButtonStatus({
        hidden: false,
        // 공백만 입력된 경우 전송 비활성
        disabled: !!textContent === false || textContent?.trim().length === 0,
      });
      setIsError(false);
      setGuideMessage(REPLY_INPUT_GUIDE);
    };

    const handleFocusText = (e: React.FocusEvent<HTMLInputElement>) => {
      const { textContent } = e.currentTarget;
      setTextFullViewStatus({
        fullIn: true,
        fullOut: false,
      });
      setSubmitButtonStatus({
        hidden: false,
        disabled: !!textContent === false || textContent?.trim().length === 0,
      });
      focusState.current = true;
      onFocus?.();
    };

    const handleBlurText = (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.currentTarget.textContent;
      if (!!value === false) {
        setTextFullViewStatus({
          fullIn: false,
          fullOut: true,
        });
        setSubmitButtonStatus({
          hidden: true,
          disabled: true,
        });

        e.currentTarget.innerText = '';
      }
      focusState.current = false;
      onBlur?.();
    };

    /**
     * 텍스트 초기화
     */
    const handleResetText = () => {
      if (textField.current) {
        setIsMultiLine(false);
        setTextFullViewStatus({
          fullIn: false,
          fullOut: true,
        });
        setSubmitButtonStatus({
          hidden: true,
          disabled: true,
        });

        textField.current.innerText = '';
      }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (textField.current) {
        const { innerText } = textField.current;
        setValue('contents', innerText.trim());
      }
      handleFormSubmit((value) => {
        handleRegisterReply(value, {
          onSuccess: () => {
            setIsError(false);
            handleResetText();
            handleResetList?.();
          },
          onError: (error) => {
            setIsError(true);
            setGuideMessage(error.data?.message ?? '');
          },
        });
      })();
    };

    /**
     * AOS 키보드 닫는 경우, 인풋 blur처리 되지 않아 영역을 잡지 못하는 이슈로 강제 blur 처리
     */
    const handleBlurTextField = useCallback(() => {
      if (textField.current && focusState.current === true) {
        textField.current.blur();
      }
    }, []);

    useEffect(() => {
      setProfileData({
        showroomCode: '',
        liveId: 0,
        image: {
          src: userInfo?.profileImage.path,
        },
        size: 44,
        status: 'none',
        disabledLink: true,
      });
    }, [userInfo]);

    useEffect(() => {
      if (replyId && textValue && textField.current) {
        textField.current.focus();
      }
    }, [replyId, textField, textValue]);

    useEffect(() => {
      document.addEventListener('touchmove', handleBlurTextField);
      return () => {
        document.removeEventListener('touchmove', handleBlurTextField);
      };
    }, [handleBlurTextField]);

    return (
      <div ref={ref} className={className} {...props}>
        {!isLogin && (
          <div className="login">
            <div className="login-inner">
              <Button is="button" variant="tertiaryline" onClick={handleLogin}>
                로그인 후 참여할 수 있습니다
              </Button>
            </div>
          </div>
        )}
        {isLogin && (
          <form onSubmit={handleSubmit}>
            <div
              className={classNames('write-section', {
                'is-full-in': textFullViewStatus.fullIn,
                'is-full-out': textFullViewStatus.fullOut,
              })}
            >
              <div className="write-box">
                <div className="write-inner">
                  <div className="user-wrapper">
                    <div className="profile-box">{profileData && <Profiles {...profileData} />}</div>
                    <div className="input-box">
                      <TextField
                        ref={textField}
                        className={classNames({
                          'is-multiline': isMultiLine,
                        })}
                        multiline
                        type="text"
                        value={textValue}
                        placeholder="댓글 입력"
                        error={isError}
                        disabled={isLoading}
                        onChange={handleChangeText}
                        onFocus={handleFocusText}
                        onBlur={handleBlurText}
                        suffix={
                          <Action
                            is="button"
                            type="submit"
                            disabled={submitButtonStatus.disabled}
                            className={classNames({
                              ...submitButtonStatus,
                            })}
                          >
                            <SendFilled />
                          </Action>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={classNames('guide', {
                  'is-error': isError,
                })}
              >
                <span className="inner">{nl2br(guideMessage)}</span>
              </div>
            </div>
          </form>
        )}
      </div>
    );
  },
);

/**
 * 댓글 작성
 */
export const ReplyInput = styled(ReplyInputComponent)`
  /** 로그인 박스 */
  & .login {
    padding: 0 2.4rem;

    & .login-inner {
      width: 100%;
      margin: 0.4rem 0;
      ${Button} {
        width: 100%;
        height: 4rem;
      }
    }
  }

  /** 댓글 작성 */
  & .write-box {
    padding: 0 2.4rem 0 1.2rem;

    & .user-wrapper {
      display: flex;
      min-height: 4rem;
      padding: 0.4rem 0;
    }
  }

  & .profile-box {
    position: relative;
    width: 5.6rem;

    ${Profiles} {
      position: absolute;
      top: -0.2rem;
      left: 0.2rem;
      opacity: 1;
    }
  }

  & .input-box {
    width: calc(100% - 5.6rem);
    color: ${({ theme }) => theme.color.brand.tint};
  }

  & .guide {
    overflow: hidden;
    max-height: 0;
    padding: 0 2.4rem;
    color: ${({ theme }) => theme.color.text.textHelper};
    font: ${({ theme }) => theme.content.contentStyle.fontType.micro};

    &.is-error {
      color: ${({ theme }) => theme.color.semantic.error};
    }

    & .inner {
      opacity: 0;
    }
  }

  & .write-section {
    &.is-full-in {
      & .write-box {
        padding-left: 2.4rem;
        transition: padding 0.25s;
      }

      & .profile-box {
        width: 0;
        transition: width 0.25s;
        ${Profiles} {
          opacity: 0;
          transition: opacity 0.1s;
        }
      }

      & .input-box {
        width: 100%;
        transition: width 0.25s;
      }

      & .guide {
        max-height: 1.5rem;
        transition: max-height 0.25s ease-out;

        & .inner {
          opacity: 1;
          transition: opacity 0.25s 0.1s ease-out;
        }
      }
    }

    &.is-full-out {
      & .write-box {
        padding-left: 1.2rem;
        transition: padding 0.25s;
      }

      & .profile-box {
        width: 5.6rem;
        transition: width 0.25s;
        ${Profiles} {
          opacity: 1;
          transition: opacity 0.25s;
        }
      }

      & .input-box {
        width: 100%;
        transition: width 0.25s;
      }

      & .guide {
        max-height: 0;
        transition: max-height 0.25s 0.1s ease-out;

        & .inner {
          opacity: 0;
          transition: opacity 0.25s ease-out;
        }
      }
    }
  }
`;

const TextField = styled(TextFieldComponent)`
  display: flex;

  & .text-inner {
    min-height: 4rem;
    max-height: 8.6rem;
    padding-top: 1.1rem;
    padding-right: 5rem;
    padding-bottom: 1.1rem;
    transition: padding 0.25s;
  }

  &.disabled {
    & .text-inner:before {
      color: ${({ theme }) => theme.color.backgroundLayout.line};
    }
  }

  & .tool-box {
    padding: 0;
  }

  & .suffix-divider {
    display: none;
  }

  & .btn-clear {
    margin-top: 0;
    transition: margin 0.25s;
  }

  ${Action} {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;

    &.disabled {
      & svg *[fill],
      svg *[stroke] {
        color: ${({ theme }) => theme.color.gray20};
      }
    }

    &.hidden {
      display: none;
    }
  }

  & .suffix-box {
    display: block;
    padding-top: 0;
    padding-right: 0.8rem;
    padding-bottom: 0;
    transition: padding 0.25s;

    &.is-muliline {
      display: flex;
    }
  }

  &.focused {
    & .text-inner {
      padding-right: 9rem;
    }
  }

  &.is-multiline {
    & .text-inner {
      margin-bottom: 1.6rem;
      padding-top: 1.6rem;
      padding-bottom: 0;
    }

    & .suffix-box {
      padding-top: 0.8rem;
    }

    & .btn-clear {
      margin-top: 0.8rem;
    }
  }
`;
