import styled, { keyframes } from 'styled-components';

export const LiveStyled = styled.div<{ height: number | null }>`
  position: relative;
  width: 100%;
  ${({ height }) =>
    height
      ? `
    height: ${height}px;
    display: flex;
    align-items: end;
  `
      : 'height: 100dvh'};
  overflow: hidden;
  background-color: ${({ theme }) => theme.light.color.black};

  ${({ theme }) => theme.mediaQuery.md} {
    background-color: ${({ theme }) => theme.light.color.black};
  }
`;

export const LiveContents = styled.div<{ height: number | null; $isMobile: boolean }>`
  position: relative;
  height: 100%;
  overflow: hidden;

  ${({ $isMobile }) =>
    !$isMobile &&
    `
    @media screen and (min-width: 992px) {
      width: calc(var(--vh, 1vh) * 100 * 1080 / 1920);
      margin: 0 auto;
    }
  `};
`;

const show = keyframes`
  0% { opacity: 0 }
  100% { opacity: 1 }
`;

const hide = keyframes`
  100% { opacity: 0 }
`;

export const LiveGradientStyled = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 12.8rem;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.4) 100%);
  pointer-events: none;

  &.hide {
    animation: ${hide} 0.2s forwards;
  }

  &.show {
    animation: ${show} 0.2s forwards;
  }
`;

export const LiveEndSectionStyled = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.s12};
`;

export const LiveGoodsWrapperStyled = styled.div`
  padding-top: ${({ theme }) => theme.spacing.s12};
`;
