import styled, { css } from 'styled-components';
import { AlignType, TextItemSizeType, VerticalAlignType } from '../../../constants';
import type { MediaAStyledProps } from '../../../models';

export const MediaAStyled = styled.div<MediaAStyledProps>`
  position: relative;
  color: ${({ color }) => color};

  .sticky-wrapper {
    position: relative;
    ${({ parallaxMode, isApp, isIOS }) => {
      if (parallaxMode) {
        if (isApp && isIOS) return `height: ${window.innerHeight * 2}px;`;
        const defaultHt = 200; // 기본 화면 뷰 2배
        return `
          height: ${defaultHt}vh;
        `;
      }
      return null;
    }}
    &.is-full-video {
      margin-top: -1px;
      margin-bottom: -1px;
    }
  }
  .full-view {
    width: 100%;
    height: 100vh;
  }
  .sticky {
    position: sticky;
    top: 0;
    left: 0;
    overflow: hidden;
  }
  .bg {
    position: relative;
    height: 100%;
    .video,
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;
    }
    &.video-bg {
      width: 100%;
    }
    &.video-bg:after {
      ${({ isOverlay }) => {
        if (isOverlay) {
          return css`
            width: 100%;
          `;
        }
        return null;
      }}
    }
    .video {
      clip-path: inset(0px 0px);
      visibility: hidden;
      width: 100% !important;
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
  .view {
    position: relative;
    width: 100%;
    overflow: hidden;
    .bg {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }
`;

export const ContentStyled = styled.div<MediaAStyledProps>`
  position: absolute;
  right: 0;
  left: 0;
  padding: 4.8rem 2.4rem;
  text-align: ${({ align }) => align};
  ${({ verticalAlign, parallaxMode }) => {
    // eslint-disable-next-line no-nested-ternary
    return verticalAlign === VerticalAlignType.CENTER
      ? `
          top: 50%;
          transform: translate(0, -50%);
        `
      : verticalAlign === VerticalAlignType.TOP
      ? `
          top: ${parallaxMode ? '5.6rem' : '0'}
        `
      : `
          bottom: ${parallaxMode ? '5.6rem' : '0'}
        `;
  }}
`;

export const ObjectStyled = styled.div.attrs((props: MediaAStyledProps) => ({
  style: {
    transform: `translate3d(0,${props.objectTranslateY}%, 0)`,
    opacity: `${props.objectOpacity}`,
  },
}))<MediaAStyledProps>`
  display: flex;
  justify-content: ${({ align }) => {
    switch (align) {
      case AlignType.LEFT:
        return 'flex-start';
      case AlignType.RIGHT:
        return 'flex-end';
      default:
        return 'center';
    }
  }};
  padding: 0 0.8rem;
  img {
    width: auto;
  }
`;

export const TitleStyled = styled.div.attrs((props: MediaAStyledProps) => ({
  style: {
    transform: `translate3d(0,${props.textEffect ? props.titleTranslateY : 0}px, 0)`,
    opacity: `${props.textEffect ? props.titleOpacity : 1}`,
  },
}))<MediaAStyledProps>`
  color: ${({ titleColor }) => titleColor};
  font: ${({ theme, titleSize }) =>
    titleSize === TextItemSizeType.LARGE
      ? theme.content.contentStyle.fontType.headlineB
      : theme.content.contentStyle.fontType.titleB};
  font-weight: ${({ theme, titleBold }) => (titleBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  word-break: keep-all;
`;

export const SubTitleStyled = styled.div.attrs((props: MediaAStyledProps) => ({
  style: {
    transform: `translate3d(0,${props.textEffect ? props.subTitleTranslateY : 0}px, 0)`,
    opacity: `${props.textEffect ? props.subTitleOpacity : 1}`,
  },
}))<MediaAStyledProps>`
  margin-top: 1.2rem;
  color: ${({ subTitleColor }) => subTitleColor};
  font: ${({ theme }) => theme.content.contentStyle.fontType.largeB};
  font-weight: ${({ theme, subTitleBold }) => (subTitleBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  word-break: keep-all;
`;

export const DescStyled = styled.div.attrs((props: MediaAStyledProps) => ({
  style: {
    transform: `translate3d(0,${props.textEffect ? props.descTranslateY : 0}px, 0)`,
    opacity: `${props.textEffect ? props.descOpacity : 1}`,
  },
}))<MediaAStyledProps>`
  margin-top: 3.2rem;
  color: ${({ descColor }) => descColor};
  font: ${({ theme }) => theme.content.contentStyle.fontType.small};
  font-weight: ${({ theme, descBold }) => (descBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  word-break: keep-all;
`;
