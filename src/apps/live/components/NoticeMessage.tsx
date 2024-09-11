import React, { useEffect, useRef, useState, useMemo } from 'react';
import styled from 'styled-components';
import { userAgent } from '@utils/ua';
import { getAppLink } from '@utils/link';
import { AppLinkTypes } from '@constants/link';
import classNames from 'classnames';
import { ProfileStatusType, Profiles, ProfilesProps } from '@pui/profiles';
import { ChevronDown } from '@pui/icon';
import { Action } from '@pui/action';
import { ProfileProps } from './ProfileInfo';

interface Props extends ProfileProps {
  profileUrl: string;
  nickname?: string;
  message: string;
  className?: string;
  tintColor?: string;
  isEllipsisNoticeMessage: boolean;
  onUpdateEllipsis: () => void;
}

export const NoticeMessage = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      message,
      className,
      profileUrl,
      nickname,
      tintColor,
      isEllipsisNoticeMessage,
      onUpdateEllipsis: handleUpdateEllipsis,
    },
    ref,
  ) => {
    const messageRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const [messageHeight, setMessageHeight] = useState(0);
    const richText = useMemo(() => {
      return message && createRichText(message, tintColor);
    }, [message, tintColor]);

    const resetMessageHeight = () => {
      setIsOverflowing(false);
      setMessageHeight(0);
    };

    useEffect(() => {
      window.addEventListener('resize', resetMessageHeight, true);
      return () => {
        window.removeEventListener('resize', resetMessageHeight, true);
        setMessageHeight(0);
        setIsOverflowing(false);
      };
    }, []);

    useEffect(() => {
      if (messageRef.current) {
        setMessageHeight(messageRef.current.scrollHeight);
      }
    }, [richText]);

    useEffect(() => {
      setIsOverflowing(
        (messageRef.current?.scrollWidth || 0) > (messageRef.current?.clientWidth || 0) ||
          (typeof richText !== 'string' && richText.isExistNewLine),
      );
    }, [richText, messageHeight]);

    useEffect(() => {
      if (messageRef.current && messageHeight === 0) {
        setMessageHeight(messageRef.current.scrollHeight);
      }
    }, [isOverflowing, messageHeight]);

    const classes = { 'is-opened': !isEllipsisNoticeMessage };

    const profileProps: ProfilesProps = {
      showroomCode: '',
      liveId: null,
      image: {
        src: profileUrl,
      },
      size: 40,
      status: ProfileStatusType.NONE,
    };

    return (
      <Wrapper className={classNames(className, classes)} messageHeight={messageHeight} ref={ref}>
        <HeaderStyled>
          <WrapperStyled>
            <Profiles {...profileProps} />
            {nickname && <NicknameStyled className="nickname">{nickname}</NicknameStyled>}
          </WrapperStyled>
          {isOverflowing && (
            <ButtonStyled type="button" onClick={handleUpdateEllipsis} className={classNames(classes)}>
              <ChevronDown name="chevronDown" size="2.4rem" />
            </ButtonStyled>
          )}
        </HeaderStyled>

        <MessageStyled
          className={classNames({ message: true, init: !!messageHeight }, classes)}
          isOverflowing={isOverflowing}
          ref={messageRef}
        >
          {richText ? richText.item : null}
        </MessageStyled>
      </Wrapper>
    );
  },
);

const Wrapper = styled.div<{ messageHeight: number }>`
  position: relative;
  display: flex;
  width: calc(100% - 8rem);
  flex-direction: column;
  padding: 0 0.8rem 0.8rem 0;
  margin-top: 0.8rem;
  color: ${({ theme }) => theme.light.color.black};
  background-color: ${({ theme }) => theme.light.color.bg};
  border-radius: 0.8rem;
  /* 기본 Element 기본 사이즈 */
  height: 6.6rem;
  transition: height 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  pointer-events: auto;
  &.is-opened {
    display: flex;
    ${({ messageHeight }) => {
      if (messageHeight) {
        /* Message Height에 HeaderStyled Height + Wrapper padding bottom 값을 계산한다 */
        const calculateHeight = messageHeight / 10 + 4 + 0.8;
        return `
          height: ${calculateHeight}rem;
          transition: height 200ms cubic-bezier(0.4, 0, 0.2, 1) 250ms;
        `;
      }
      return `
        height: 100%;
      `;
    }};
  }
`;

const HeaderStyled = styled.div`
  position: relative;
`;

const ButtonStyled = styled.button`
  -webkit-tap-highlight-color: transparent;
  ${({ theme }) => theme.mixin.absolute({ r: 0, t: 0 })}
  height: 4rem;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  ${ChevronDown} {
    transform: rotate(0deg);
    transition: transform 200ms ease-out;
  }
  &.is-opened {
    ${ChevronDown} {
      transform: rotate(-180deg);
    }
  }
`;

const MessageStyled = styled.div<{ isOverflowing: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.s15};
  line-height: 1.8rem;
  padding: 0 0 0 0.8rem;
  margin-top: 0;
  width: 100%;
  display: inline-block;
  overflow: hidden;
  white-space: normal;
  word-break: break-all;

  &.init {
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.init.is-opened {
    white-space: ${({ isOverflowing }) => (isOverflowing ? 'normal' : 'nowrap')};
  }
`;

const WrapperStyled = styled.div`
  display: flex;
  align-items: center;
`;

const NicknameStyled = styled.span`
  font-size: 1.2rem;
  margin-left: 0.5rem;
`;

/**
 * 문자열 중 줄바꿈/링크 요소인 경우 태그로 변환하여 JSX.Element[], isExistNewLine 로 반환
 *
 * 링  크: http~ => <a />
 * 줄바꿈: \n\n  => <br />
 *
 * @param description {string}
 * @returns { item: JSX.Element[], isExistNewLine: boolean }
 */
const createRichText = (originText: string, color: string | undefined) => {
  const urlRegExp = /(https?:\/\/[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b[-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g;
  const httpRegExp = /^(https:\/\/|http:\/\/)/g;
  const newLineRegExp = /(\n)/g;

  const splitText: Array<string> = originText
    .trim()
    .split(urlRegExp)
    .map((text) => {
      if (!text) {
        return '';
      }

      if (newLineRegExp.test(text)) {
        const split = text.split(newLineRegExp);
        if (typeof split.flat === 'function') {
          return split.flat();
        }
        return text;
      }
      return text;
    })
    .flat()
    .filter((text) => !!text);

  /**
   * @todo 링크에대한 속성 정의필요
   */
  return {
    item:
      splitText.length > 0
        ? splitText.map((text, index) => {
            const key = `${text}+${index}`;

            // 링크 요소
            if (urlRegExp.test(text)) {
              const getLink = userAgent().isApp
                ? (url: string) => getAppLink(AppLinkTypes.EXTERNAL_WEB, { landingType: 'modal', url })
                : (url: string) => url;

              return (
                <AnchorStyled $color={color}>
                  <Action
                    key={key}
                    is="a"
                    link={getLink(text)}
                    target="_blank"
                    children={text.replace(httpRegExp, '')}
                  />
                </AnchorStyled>
              );
            }

            // 줄바꿈 요소
            if (/\n/g.test(text)) {
              return <br key={key} />;
            }

            // 택스트
            return <React.Fragment key={key}>{text}</React.Fragment>;
          })
        : null,
    isExistNewLine: splitText.filter((text) => newLineRegExp.test(text)).length > 0,
  };
};

/** 밑줄 표시된 링크 */
const AnchorStyled = styled(Action)<{ $color: string | undefined }>`
  color: ${({ $color, theme }) => $color || theme.light.color.black};

  a {
    text-decoration: underline;
  }
`;
