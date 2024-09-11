import { Image, ImageProps } from '@pui/image';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

export interface PrizmPayCardLogoImageProps extends ImageProps {
  isPlay?: boolean;
  color: string;
}

export const PrizmPayCardLogoImage = styled(({ isPlay, className, color, ...rest }) => {
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isPlay) {
      setTimeout(() => {
        elRef.current?.classList.add('active');
      }, 200);
    }
  }, [isPlay]);

  return (
    <span className={className} ref={elRef}>
      <Image {...rest} className="logo-img" />
    </span>
  );
})`
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ color: backgroundColor }) => backgroundColor};
  padding: 0.8rem 1.2rem;
  min-width: 9.6rem;
  width: 9.6rem;
  min-height: 6.4rem;
  height: 6.4rem;
  border-radius: ${({ theme }) => theme.radius.s8};
  overflow: hidden;

  & .logo-img {
    width: 7.2rem;
    height: 4.8rem;
    background: none;
  }

  &.disabled::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => (theme.isDarkMode ? theme.light.color.gray50 : theme.dark.color.gray50)};
    opacity: 0.7;
    border-radius: ${({ theme }) => theme.radius.s8};
    width: auto;
    height: auto;
    transform: none;
  }

  &::after {
    position: absolute;
    content: '';
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.243478) 22.92%,
      rgba(255, 255, 255, 0.32) 47.92%,
      rgba(255, 255, 255, 0.236) 73.44%,
      rgba(255, 255, 255, 0) 100%
    );
    width: 17.8rem;
    height: 6rem;
    transform: translate(-120px, 0) rotate(45deg);
    transition: transform 0.8s ease-out;
  }

  &.active::after {
    transform: translate(120px, 0) rotate(45deg);
  }
`;
