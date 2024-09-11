import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  background: #000;
`;

export const SectionStyled = styled.section`
  &.content-2 {
    background: ${({ theme }) => theme.light.color.black};
    padding-top: 4.2rem;
    & > .video-area {
      position: relative;
      height: 46.7rem;
      padding: 0 1.192rem;
      margin-bottom: 4.8rem;

      & > .video-mask-area {
        width: 100%;
        height: 33.145rem;
        background: linear-gradient(180deg, #000000 28.13%, rgba(0, 0, 0, 0) 100%);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }
    }
    & > .reservation {
      margin-bottom: 3.2rem;
    }
    & > .item-list-1 {
      /* padding: 0 5.5rem; */
    }
  }

  &.content-3 {
    background: ${({ theme }) => theme.light.color.white};
    padding-top: 4.8rem;
    & > .desc-area {
      padding-bottom: 3.2rem;
      text-align: center;
      & > h1 {
        font: ${({ theme }) => theme.fontType.t24B};
        margin-bottom: 2.4rem;
      }
      & > p {
        font: ${({ theme }) => theme.fontType.t15};
      }
    }
    & > .item-list-2 {
    }
  }

  & > footer {
    background: ${({ theme }) => theme.light.color.black};
    padding: 4.8rem 0 13.6rem 0;

    & > .logo {
      width: 10rem;
      height: 1.8rem;
      margin: 0 auto;
    }
    & > .info {
      margin-top: 1.6rem;
      line-height: 1.3rem;
      font-size: ${({ theme }) => theme.fontSize.s10};
      font-family: Montserrat;
      color: ${({ theme }) => theme.light.color.white};
      text-align: center;
    }
  }
`;

export const HeaderStyled = styled.header`
  height: 5.6rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2;
  padding: 1.4rem 0;
  mix-blend-mode: difference;

  & > .logo-area {
    height: 2.8rem;
    width: 12.8rem;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    display: block;

    & > .logo {
      height: 100%;
    }
  }

  & > .logo {
    margin: 0 auto;
  }
`;

export const FloatingStyled = styled.div`
  position: fixed;
  z-index: 2;
  width: 100%;
  bottom: 0;
  padding: 2.4rem 2.4rem 2.4rem;

  & .in-pc {
    display: flex;

    & .first {
      margin-right: 0.6rem;
    }

    & .second {
      margin-left: 0.6rem;
    }
  }

  & .floating-button {
    width: 100%;
    height: 5.6rem;
    border: 0.1rem solid #fff;
    box-sizing: border-box;
    backdrop-filter: blur(5rem);
    border-radius: 0.8rem;
    display: inline-block;
    background: rgba(0, 0, 0, 0.3);
    font: ${({ theme }) => theme.fontType.t18B};
    color: ${({ theme }) => theme.light.color.white};
    overflow: hidden;
    transform: translate3d(0, 0, 0);
    display: flex;
    justify-content: center;
    align-items: center;

    &.open-version {
      display: flex;
      align-items: center;
      z-index: 2;

      & .app-icon {
        margin-right: 1.2rem;
      }

      & > svg {
        & *[fill] {
          fill: ${({ theme }) => theme.light.color.white};
          transition: fill 0.2s ease-in-out, opacity 0.2s ease-in-out;
        }
        & *[stroke] {
          stroke: ${({ theme }) => theme.light.color.white};
          transition: stroke 0.2s ease-in-out, opacity 0.2s ease-in-out;
        }
        z-index: 2;
      }

      & > p {
        font: ${({ theme }) => theme.fontType.t15B};
        color: ${({ theme }) => theme.light.color.white};
        display: inline-block;
      }
    }

    & > p {
      position: relative;
      color: ${({ theme }) => theme.light.color.white};
      transition: color 0.2s ease-in-out, opacity 0.2s ease-in-out;
      display: inline-block;
      z-index: 2;
    }

    &:active {
      opacity: 1;
      & > p {
        color: ${({ theme }) => theme.light.color.black};
      }
      & > svg {
        & *[fill] {
          fill: ${({ theme }) => theme.light.color.black};
        }
        & *[stroke] {
          stroke: ${({ theme }) => theme.light.color.black};
        }
      }
    }

    &:active::after {
      transform: scale3d(15, 15, 1) rotateZ(15deg) translate3d(0, 0, 0);
    }

    &::after {
      background-color: #fff;
      bottom: 0;
      content: '';
      height: 100%;
      left: 0;
      position: absolute;
      transform: scale3d(5, 5, 1) rotateZ(0deg) translate3d(0, 100%, 0);
      transition: transform 0.3s ease-in-out;
      width: 100%;
      z-index: 1;
    }
  }
`;
