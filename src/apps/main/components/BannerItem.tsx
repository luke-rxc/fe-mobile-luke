import React from 'react';
import styled from 'styled-components';
import { Action } from '@pui/action';
import { SVG } from '@pui/svg';
import { BannerMedia, BannerMediaProps } from './BannerMedia';
import { BannerProfileProps } from './BannerProfile';

export interface BannerItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 배너 링크 */
  link: string;
  /** 배너 타이틀 */
  title: string;
  /** 배너 서브타이틀 및 description */
  description: string;
  /** 미디어 정보 */
  mediaInfo: BannerMediaProps;
  /** 프로필 정보 */
  profileInfo: BannerProfileProps;
  /** SVG 로고 이미지 */
  logoList?: { id: number; path: string }[];
  /** view에 표시 여부 */
  inView?: boolean;
  /** 배너 링크 클릭시 실행할 이벤트 콜백 */
  onClickLink?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, props: BannerItemProps) => void;
}

/**
 * Banner Item
 */
export const BannerItem = styled((props: BannerItemProps) => {
  const { title, description, link, mediaInfo, profileInfo, logoList, inView, onClickLink, ...rest } = props;
  const handleClickLink = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    onClickLink?.(e, props);
  };

  return (
    <div {...rest}>
      <Action is="a" className="banner-content" link={link} onClick={handleClickLink}>
        <span className="banner-headline">
          {logoList && (
            <ul className="banner-logo-list">
              {logoList.map((logo) => (
                <li className="banner-logo-item" key={logo.id}>
                  <SVG src={logo.path} />
                </li>
              ))}
            </ul>
          )}
          <span className="title">{title}</span>
          <span className="description">{description}</span>
        </span>

        <span className="banner-media">
          <BannerMedia {...{ ...mediaInfo, inView }} />
        </span>
      </Action>
    </div>
  );
})`
  overflow: hidden;
  position: relative;
  z-index: 0;
  width: 100%;
  padding-top: 133.3333%;

  /**
   * 해상도 674px 이상(갤럭시 폴드) 대응
   * https://rxc.atlassian.net/browse/PQ-1316
   */
  @media screen and (min-width: 674px) {
    padding-top: 60rem;
  }

  .banner-content {
    ${({ theme }) => theme.mixin.absolute({ l: 0, t: 0 })};
    width: 100%;
    height: 100%;

    &:after {
      ${({ theme }) => theme.mixin.absolute({ l: 0, r: 0 })};
      z-index: 1;
      width: 100%;
      content: '';
    }

    &:after {
      bottom: 0;
      height: 9.6rem;
      background: ${({ theme }) => `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${theme.color.surface} 100%)`};
    }

    .banner-headline {
      ${({ theme }) => theme.mixin.absolute({ r: 0, b: 0, l: 0 })};
      ${({ theme }) => theme.mixin.wordBreak()};
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 2;
      height: 24.8rem;
      padding: ${({ theme }) => `6.4rem ${theme.spacing.s24} ${theme.spacing.s24}`};
      color: ${({ theme }) => theme.color.whiteLight};
      text-align: center;

      .title {
        ${({ theme }) => theme.mixin.multilineEllipsis(2, 33)};
        font: ${({ theme }) => theme.fontType.headline2B};
        white-space: pre-line;
      }

      .description {
        ${({ theme }) => theme.mixin.multilineEllipsis(2, 17)};
        margin-top: ${({ theme }) => theme.spacing.s8};
        font: ${({ theme }) => theme.fontType.small};
        white-space: pre-line;
      }
    }

    .banner-media {
      ${({ theme }) => theme.mixin.absolute({ t: 0, l: 0 })};
      display: flex;
      align-items: center;
      z-index: -1;
      overflow: hidden;
      width: 100%;
      height: 100%;

      ${BannerMedia} {
        transform: scale(1.05);
        transition: transform 0.2s ease-in;
      }
    }

    &:active ${BannerMedia} {
      transform: scale(1);
    }
  }

  .banner-logo-list {
    ${({ theme }) => theme.mixin.absolute({ t: '2.4rem', r: 0, l: 0 })};
    display: flex;
    justify-content: center;
  }

  .banner-logo-item {
    height: 2.4rem;

    &:not(:first-of-type) {
      &::before {
        display: inline-block;
        margin: ${({ theme }) => `0.4rem ${theme.spacing.s8} 0`};
        width: 0.1rem;
        height: 1.6rem;
        background: currentColor;
        vertical-align: top;
        content: '';
      }
    }

    ${SVG} {
      max-width: 11.2rem;
      height: 100%;
      * {
        fill: currentColor !important;
      }
    }
  }
`;
