import styled, { css } from 'styled-components';
import { TextItemSizeType } from '../../../constants';
import type { MediaBStyledProps } from '../../../models';

export const MediaBStyled = styled.div<MediaBStyledProps>`
  position: relative;
  color: ${({ color }) => color};
  background: ${({ background }) => background.color};
  .sticky-wrapper {
    position: relative;
    ${({ isApp, isIOS }) => {
      if (isApp && isIOS) return `height: ${window.innerHeight * 2}px;`;
      const defaultHt = 200; // 기본 화면 뷰 2배
      return `
        height: ${defaultHt}vh;
      `;
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
`;
export const ContentStyled = styled.div<MediaBStyledProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 4.8rem 2.4rem 3.2rem;
  color: ${({ color }) => color};
  text-align: ${({ align }) => align};
  img {
    vertical-align: middle;
  }
  .middle-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: auto;
    }
  }
  .text-wrapper {
    position: relative;
    z-index: 1;
    padding-top: 5.6rem;
  }
  .title + .sub {
    margin-top: 1.2rem;
  }
  .title + .desc {
    margin-top: 3.2rem;
  }
  .sub + .desc {
    margin-top: 3.2rem;
  }
`;

export const FrontImageStyled = styled.div.attrs((props: MediaBStyledProps) => ({
  style: {
    transform: `translate3d(0, ${props.frontImageTranslateY}%, 0)`,
  },
}))<MediaBStyledProps>`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  & .front-image {
    line-height: initial;
  }
  img {
    width: auto;
  }
`;

export const TitleStyled = styled.div.attrs((props: MediaBStyledProps) => ({
  style: {
    transform: `translate3d(0, ${props.textEffect ? props.titleTranslateY : 0}px, 0)`,
    opacity: `${props.textEffect ? props.titleOpacity : 1}`,
  },
}))<MediaBStyledProps>`
  color: ${({ titleColor }) => titleColor};
  font: ${({ theme, titleSize }) =>
    titleSize === TextItemSizeType.LARGE
      ? theme.content.contentStyle.fontType.headlineB
      : theme.content.contentStyle.fontType.titleB};
  font-weight: ${({ theme, titleBold }) => (titleBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  word-break: keep-all;
`;

export const SubTitleStyled = styled.div.attrs((props: MediaBStyledProps) => ({
  style: {
    transform: `translate3d(0, ${props.textEffect ? props.subTitleTranslateY : 0}px, 0)`,
    opacity: `${props.textEffect ? props.subTitleOpacity : 1}`,
  },
}))<MediaBStyledProps>`
  color: ${({ subTitleColor }) => subTitleColor};
  font: ${({ theme }) => theme.content.contentStyle.fontType.largeB};
  font-weight: ${({ theme, subTitleBold }) => (subTitleBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  word-break: keep-all;
`;

export const DescStyled = styled.div.attrs((props: MediaBStyledProps) => ({
  style: {
    transform: `translate3d(0, ${props.textEffect ? props.descTranslateY : 0}px, 0)`,
    opacity: `${props.textEffect ? props.descOpacity : 1}`,
  },
}))<MediaBStyledProps>`
  color: ${({ descColor }) => descColor};
  font: ${({ theme }) => theme.content.contentStyle.fontType.small};
  font-weight: ${({ theme, descBold }) => (descBold ? theme.fontWeight.bold : theme.fontWeight.regular)};
  word-break: keep-all;
`;
