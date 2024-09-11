import styled, { keyframes } from 'styled-components';
import { VerticalAlignType } from '../../../constants';
import type { HeaderStyledProps, LogoStyledProps, ItemStyledProps } from '../../../models';

export const HeaderStyled = styled.div<HeaderStyledProps>`
  position: relative;
  background-color: ${({ color }) => color};

  .footer {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .view {
    position: relative;
    width: 100%;
    padding-top: ${({ height }) => height}rem;
    overflow: hidden;
    .bg {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: 100%;
      .video,
      img {
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
  }
`;

/**
 * 로고 영역
 * @param to
 * @returns
 */
const moveLogo = (to: { x: number }) => keyframes`
  0%{
    transform: translate3d(0,0,0);
  }
  100%{
    transform: translate3d(${to.x}px,0px,0px);
  }
`;

export const LogoStyled = styled.div<LogoStyledProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => `${props.width}px`};
  height: 100%;
  transform: translate3d(0, 0, 0);
  img {
    height: 100%;
  }
  &.on {
    animation: ${(props: LogoStyledProps) => moveLogo(props.to)} 1s forwards ease-out;
  }
`;

/**
 * object 요소 영역
 * @param degNum
 * @returns
 */
const moveItem = (degNum: number) => keyframes`
  0%  {transform: translate3d(100%, 0%, 0) rotate(${degNum}deg);}
  100% {transform: translate3d(0%, 0%, 0) rotate(0);}
`;

export const ItemStyled = styled.div<ItemStyledProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: ${({ verticalAlign }) => (verticalAlign === VerticalAlignType.CENTER ? 'center' : 'flex-end')};
  height: 100%;
  transform: translate3d(100%, 0%, 0);
  img {
    flex-basis: 100%;
  }
  &.on {
    animation: ${(props: ItemStyledProps) => moveItem(props.verticalAlign === VerticalAlignType.CENTER ? 14 : 0)} 1s
      forwards ease-out;
  }
`;
