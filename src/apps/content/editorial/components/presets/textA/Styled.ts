import styled, { css } from 'styled-components';
import { ContentsBackgroundType } from '../../../constants';
import type { TextAStyledProps } from '../../../models';

export const TextAStyled = styled.div<TextAStyledProps>`
  position: relative;
  background-color: ${({ background }) => background.color};
  .sticky-wrap {
    ${({ useBackground, parallaxMode, contentHeight, background }) => {
      if (useBackground && parallaxMode && background.type === ContentsBackgroundType.MEDIA) {
        // 컨텐츠 높이 만큼
        const value = contentHeight > window.innerHeight ? '100vh' : `${contentHeight}px`;
        return css`
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: ${value};
          overflow: hidden;
        `;
      }
      return null;
    }}
    &:after {
      ${({ isOverlay }) => {
        if (isOverlay) {
          return css`
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            display: block;
            background: ${({ theme }) => theme.color.gray50};
            content: '';
          `;
        }
        return null;
      }}
    }
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    img,
    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .video {
      width: 100% !important;
      visibility: hidden;
      &.done {
        visibility: visible;
      }
    }
    .video-poster {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;
    }
    .overlay-error {
      width: 100%;
      height: 100%;
      background: ${({ theme }) => theme.color.gray8};
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .contents {
    position: relative;
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    padding-top: ${({ layoutMarginTop }) => `${layoutMarginTop ? 4.8 : 0}rem`};
    padding-bottom: ${({ layoutMarginBottom }) => `${layoutMarginBottom ? 4.8 : 0}rem`};
    overflow: hidden;
    ${({ useBackground, parallaxMode, background, contentHeight }) => {
      if (useBackground && parallaxMode && background.type === ContentsBackgroundType.MEDIA) {
        // 컨텐츠 높이 만큼
        const value = contentHeight > window.innerHeight ? '-100vh' : `-${contentHeight}px`;
        return css`
          margin-top: ${value};
        `;
      }
      return null;
    }}
    color: ${({ color, theme }) => color || theme.color.text.textPrimary};
    text-align: ${({ align }) => align};
    word-break: break-all;
    img {
      vertical-align: middle;
    }
    .title-wrapper {
      margin-top: 1.6rem;
      word-break: keep-all;
      &:first-child {
        margin-top: 0;
      }
      &.title1 {
        &.size-title {
          font: ${({ theme }) => theme.content.contentStyle.fontType.title};
        }
        &.size-headline {
          font: ${({ theme }) => theme.content.contentStyle.fontType.headline};
        }
      }
      &.title2 {
        &.size-title {
          font: ${({ theme }) => theme.content.contentStyle.fontType.title};
        }
        &.size-headline {
          font: ${({ theme }) => theme.content.contentStyle.fontType.headline};
        }
      }
      &.subtitle1 {
        &.size-medium {
          font: ${({ theme }) => theme.content.contentStyle.fontType.medium};
        }
      }

      &.subtitle2 {
        &.size-medium {
          font: ${({ theme }) => theme.content.contentStyle.fontType.medium};
        }
      }
      &.subtitle3 {
        &.size-medium {
          font: ${({ theme }) => theme.content.contentStyle.fontType.medium};
        }
        &.size-large {
          font: ${({ theme }) => theme.content.contentStyle.fontType.large};
        }
      }
    }
    .top-wrapper + .middle-wrapper {
      margin-top: 2.4rem;
    }
    .top-wrapper + .bottom-wrapper {
      margin-top: 2.4rem;
    }
    .middle-wrapper + .bottom-wrapper {
      margin-top: 2.4rem;
    }
    .description-wrapper {
      margin-top: 1.6rem;
      word-break: keep-all;
      &:first-child {
        margin-top: 0;
      }
    }
    .subtitle1 + .title1 {
      margin-top: 0.4rem;
    }
    .subtitle2 + .title2 {
      margin-top: 1rem;
    }
    .subtitle2 + .subtitle3 {
      margin-top: 0.4rem;
    }
    .title2 + .subtitle3 {
      margin-top: 0.4rem;
    }

    .media-wrapper {
      margin-top: 1.6rem;
      margin-bottom: 2.4rem;
      &:first-child {
        margin-top: 0;
      }
      &:last-child {
        margin-bottom: 0;
      }

      & .media-view {
        position: relative;
        width: 100%;
        overflow: hidden;
        border-radius: ${({ theme, isMediaRound }) => isMediaRound && theme.radius.r8};
        & img,
        video {
          border-radius: ${({ theme, isMediaRound }) => isMediaRound && theme.radius.r8};
        }
      }
    }

    .desc-wrapper {
      margin-bottom: 1.6rem;
      &:last-child {
        margin-bottom: 0;
      }
      &.size-small {
        font: ${({ theme }) => theme.content.contentStyle.fontType.small};
      }
      &.size-mini {
        font: ${({ theme }) => theme.content.contentStyle.fontType.mini};
      }
    }
  }
`;

export const TextStyled = styled.p<{ bold: boolean; color: string }>`
  color: ${({ color }) => color};
  font-weight: ${({ theme, bold }) => (bold === true ? theme.fontWeight.bold : theme.fontWeight.regular)}!important;
`;
