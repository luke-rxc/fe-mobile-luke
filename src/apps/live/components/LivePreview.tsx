import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { LiveViewMode } from '../constants';

interface Props {
  coverImage?: string;
  title?: string;
  description?: string;
  emptyDealGoods: boolean;
  liveMode: LiveViewMode;
}

// ms 기준
const TransitionTime = 300;

export const LivePreview = ({ coverImage, title, description, emptyDealGoods, liveMode }: Props) => {
  const [className, setClassName] = useState('default');
  const [isView, setIsView] = useState(true);

  useEffect(() => {
    if (liveMode !== LiveViewMode.LIVE) {
      return;
    }

    setClassName('loading');
    const timeout = setTimeout(() => {
      setClassName('hide');
    }, TransitionTime);

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timeout);
    };
  }, [liveMode]);

  useEffect(() => {
    if (className !== 'hide') {
      return;
    }
    const timeout = setTimeout(() => {
      setIsView(false);
    }, TransitionTime);

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timeout);
    };
  }, [className]);

  if (!isView) {
    return null;
  }

  return (
    <WrapperStyled>
      <ImageWrapperStyled backgroundImage={coverImage} $onlyTitle={emptyDealGoods} className={className}>
        <InfoWrapperStyled $onlyTitle={emptyDealGoods}>
          <InfoTitleStyled>{title}</InfoTitleStyled>
          <InfoDescriptionStyled>{description}</InfoDescriptionStyled>
        </InfoWrapperStyled>
      </ImageWrapperStyled>
    </WrapperStyled>
  );
};

const fadeIn = keyframes`
  from { transform: translateX(6.0rem); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const hide = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const WrapperStyled = styled.div`
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  justify-content: center;
  background-color: ${({ theme }) => theme.light.color.black};
`;

const ImageWrapperStyled = styled.div<{ backgroundImage?: string; $onlyTitle: boolean }>`
  position: relative;
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
  flex-direction: column-reverse;
  width: 100%;
  height: calc(100vh - 5.6rem);
  height: calc(var(--vh, 1vh) * 100 - 5.6rem);
  padding-bottom: ${({ $onlyTitle }) => ($onlyTitle ? 0 : '9.6rem')};
  background-image: ${({ backgroundImage }) => backgroundImage && `url(${backgroundImage})`};
  background-position: center center;
  background-size: cover;
  opacity: 1;

  &.hide {
    opacity: 0;
    transition: ${TransitionTime}ms linear 0s normal forwards opacity;
  }
`;

const InfoWrapperStyled = styled.div<{ $onlyTitle: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  color: ${({ theme }) => theme.light.color.white};
  padding: 1.6rem 1.6rem;
  ${({ theme, $onlyTitle }) => theme.mixin.safeArea('padding-bottom', 16 + ($onlyTitle ? 0 : 96))};
  animation: 500ms linear 0s normal forwards ${fadeIn};
  z-index: 2;
  font-size: ${({ theme }) => theme.fontSize.s15};
  will-change: transform;

  .loading > & {
    animation: 1s linear 0s normal forwards ${hide};
  }
`;

const InfoTitleStyled = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: 3.2rem;
  line-height: 3.8rem;
  margin-bottom: 0.8rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const InfoDescriptionStyled = styled.div`
  line-height: 1.8rem;
`;
