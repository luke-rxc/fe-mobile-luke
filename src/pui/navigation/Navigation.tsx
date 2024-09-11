/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { forwardRef, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import classnames from 'classnames';
import { useLocation } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { useUpdateEffect } from 'react-use';
import { redirectToLogin } from '@utils/redirectToLogin';
import { Action } from '@pui/action';
import { Divider } from '@pui/divider';
import { List } from '@pui/list';
import { ListItemTitle, ListItemTitleProps } from '@pui/listItemTitle';
import { Image } from '@pui/image';
import { Home, Search, Bell } from '@pui/icon';
import { getWebLink } from '@utils/link';
import { WebLinkTypes } from '@constants/link';
import { LogEventTypes } from '@features/landmark/constants';

const DisableBodyScroll = createGlobalStyle`
  body {
    overflow: hidden !important;
    pointer-events: none !important;
  }
`;

export interface NavigationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onTransitionEnd'> {
  /** 네비게이션 show/hide 여부 */
  open?: boolean;
  /** 로그인 정보 */
  userInfo?: { nickname: string; profileImage?: string };
  /** 장바니에 담긴 아이템 수 */
  cartCount?: number;
  /** 신규 알림 개수 */
  notiCount?: number;
  /** dimmed 클릭시 네비게이션을 hide하기 위한 이벤트 핸들러 */
  onClose?: () => void;
  /** TransitionStart 이벤트핸들러 */
  onTransitionStart?: (open: boolean) => void;
  /** TransitionEnd 이벤트핸들러 */
  onTransitionEnd?: (open: boolean) => void;
  /** 클릭 이벤트 적재를 위한 핸들러 */
  onClickTitle?: (logEvent: string) => void;
}
const NavigationComponent = forwardRef<HTMLDivElement, NavigationProps>(
  (
    {
      open = false,
      userInfo,
      cartCount,
      notiCount,
      className,
      onClose,
      onTransitionEnd,
      onTransitionStart,
      onClickTitle: handleClickTitle,
      ...props
    },
    ref,
  ) => {
    const location = useLocation();
    /**
     * 모션 시작/종료에 대한 시점을 캐치하기 위한 타겟 Ref
     */
    const transitionTarget = useRef<HTMLDivElement>(null);

    /**
     * 네비게이션 display none/block
     */
    const [isDisplay, setDisplay] = useState<boolean>(open);

    /**
     * 네비게이션 show/hide
     */
    const [isOpen, setOpen] = useState<boolean>(open);

    /**
     * root 컴포넌트의 className
     */
    const classNames = classnames(className, { 'is-open': isOpen, 'is-display': isDisplay });

    /**
     * 네비게이션이 hide되고 실행할 콜백
     */
    const handleAfterClose = (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target !== transitionTarget.current || e.propertyName !== 'opacity') {
        return;
      }

      if (!isOpen && window.getComputedStyle(e.target as unknown as Element).opacity === '0') {
        setDisplay(false);
        onTransitionEnd?.(false);
      } else {
        onTransitionEnd?.(true);
      }
    };

    /**
     * 로그인
     */
    const handleLogin = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      redirectToLogin();
      handleClickTitle?.(LogEventTypes.LogMyTabSignIn);
    };

    /**
     * 네비게이션 아이템클릭 이벤트 핸들러
     */
    const handleClickNavItem =
      (eventType?: string) => (e: React.MouseEvent<HTMLAnchorElement>, item: ListItemTitleProps) => {
        // 현재 페이지에 해당하는 아이템 클릭시 새로고침
        if (location.pathname === item?.link) {
          e.preventDefault();
          window.location.href = item?.link;
        }

        eventType && handleClickTitle?.(eventType);
      };

    /**
     * open props의 변경시 네비게이션 show/hide 처리
     */
    useUpdateEffect(() => {
      open
        ? // show
          window.requestAnimationFrame(() => {
            onTransitionStart?.(true);
            flushSync(() => setDisplay(true));
            window.requestAnimationFrame(() => {
              flushSync(() => setOpen(true));
            });
          })
        : // hide
          window.requestAnimationFrame(() => {
            onTransitionStart?.(false);
            flushSync(() => setOpen(false));
          });
    }, [open]);

    return (
      <div ref={ref} className={classNames} {...props} aria-expanded={open}>
        {open && <DisableBodyScroll />}
        <div
          className="nav-dimmed"
          ref={transitionTarget}
          onTransitionEnd={handleAfterClose}
          onClick={onClose}
          onTouchMove={onClose}
        />
        <div className="nav-content">
          <div className="nav-content-inner">
            {!userInfo && <Action is="a" className="login" onClick={handleLogin} children="로그인" />}
            {!userInfo && <Divider />}

            <List className="nav-links">
              <ListItemTitle
                noArrow
                link={getWebLink(WebLinkTypes.HOME)}
                icon={<Home />}
                onClickTitle={handleClickNavItem(LogEventTypes.LogMyTabHome)}
              >
                홈
              </ListItemTitle>
              <ListItemTitle
                noArrow
                link={getWebLink(WebLinkTypes.SEARCH)}
                icon={<Search />}
                onClickTitle={handleClickNavItem(LogEventTypes.LogMyTabSearch)}
              >
                검색
              </ListItemTitle>
              <ListItemTitle
                noArrow
                className={classnames({ 'is-new': !!notiCount })}
                link={getWebLink(WebLinkTypes.NOTIFICATIONS)}
                icon={<Bell />}
                onClickTitle={handleClickNavItem(LogEventTypes.LogMyTabNotification)}
              >
                알림
              </ListItemTitle>
              {userInfo && (
                <ListItemTitle
                  noArrow
                  link={getWebLink(WebLinkTypes.MYPAGE)}
                  className="userinfo"
                  icon={<Image noFallback src={userInfo?.profileImage} />}
                  onClickTitle={handleClickNavItem()}
                >
                  {userInfo?.nickname}
                </ListItemTitle>
              )}
            </List>

            <Divider />

            <List className="nav-links">
              {userInfo && (
                <ListItemTitle
                  noArrow
                  link={getWebLink(WebLinkTypes.WISH_LIST)}
                  onClickTitle={handleClickNavItem(LogEventTypes.LogMyTabWish)}
                >
                  위시리스트
                </ListItemTitle>
              )}
              <ListItemTitle noArrow link={getWebLink(WebLinkTypes.GOODS_HISTORY)} onClickTitle={handleClickNavItem()}>
                최근 본 상품
              </ListItemTitle>
              <ListItemTitle
                noArrow
                link={getWebLink(WebLinkTypes.CONTENTS_HISTORY)}
                onClickTitle={handleClickNavItem()}
              >
                최근 본 콘텐츠
              </ListItemTitle>
            </List>

            <Divider />

            <List className="nav-links">
              <ListItemTitle noArrow link={getWebLink(WebLinkTypes.MYPAGE_SETTING)} onClickTitle={handleClickNavItem()}>
                설정
              </ListItemTitle>
              <ListItemTitle noArrow link={getWebLink(WebLinkTypes.CS_NOTICE_LIST)} onClickTitle={handleClickNavItem()}>
                공지사항
              </ListItemTitle>
              <ListItemTitle noArrow link={getWebLink(WebLinkTypes.CS_FAQ_LIST)} onClickTitle={handleClickNavItem()}>
                FAQ
              </ListItemTitle>
              {userInfo && (
                <ListItemTitle noArrow link={getWebLink(WebLinkTypes.CS_QNA_LIST)} onClickTitle={handleClickNavItem()}>
                  1:1문의
                </ListItemTitle>
              )}
            </List>
          </div>
        </div>
      </div>
    );
  },
);

/**
 * Navigation 컴포넌트
 *
 * @TODO - 링크 연결
 * @TODO - 링크 요소를 하드 코딩이 아닌 props로 받는 형태로 변경
 * @TODO - header height에 영향을 받는 padding-top에 대한 고민 필요(현재는 5.6rem 하드코딩)
 */
export const Navigation = styled(NavigationComponent)`
  /** header size */
  --header-height: 5.6rem;

  ${({ theme }) => theme.mixin.fixed({ t: 0, l: 0 })};
  ${({ theme }) => theme.mixin.z('navigation')};
  display: none;
  width: 100vw;
  height: 100vh;
  pointer-events: initial;

  &.is-display {
    display: block;
  }

  .nav-dimmed {
    ${({ theme }) => theme.mixin.z('navigation')};
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #000;
    opacity: 0;
    transition: opacity 400ms;

    .is-open& {
      opacity: 0.4;
      transition: opacity 400ms;
    }
  }

  .nav-content {
    ${({ theme }) => theme.mixin.absolute({ t: 0, r: 0 })};
    ${({ theme }) => theme.mixin.z('navigation')};
    box-sizing: border-box;
    overflow: hidden;
    width: 30.4rem;
    height: 100vh;
    padding-top: var(--header-height);
    background: ${({ theme }) => theme.color.whiteVariant1};
    will-change: transform;
    transform: translate3d(101%, 0, 0);
    transition: transform 400ms;

    .is-open& {
      transform: translate3d(0%, 0, 0);
    }

    &-inner {
      box-sizing: border-box;
      overflow: hidden;
      overflow-y: auto;
      width: 100%;
      height: calc(100% - var(--header-height));
      padding: 1.2rem 0 6.8rem;
    }
  }

  ${Action}.login {
    display: block;
    padding: 3.3rem 2.4rem;
    font: ${({ theme }) => theme.fontType.largeB};
  }

  ${Divider} {
    padding-top: 1.2rem;
    padding-bottom: 1.2rem;
  }

  ${ListItemTitle}.is-new {
    .item-icon {
      position: relative;

      &:after {
        ${({ theme }) => theme.mixin.absolute({ t: 2, r: 2 })};
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        background: ${({ theme }) => theme.color.red};
        content: '';
      }
    }
  }

  ${ListItemTitle}.userinfo {
    .item-content {
      font-weight: bold;
    }

    ${Image} {
      display: block;
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 50%;
      transform: translate3d(0, 0, 0);
    }
  }
`;
