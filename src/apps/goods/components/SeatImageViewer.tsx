import React, { RefObject, MouseEvent } from 'react';
import styled from 'styled-components';
import { Image } from '@pui/image';
import { Portal } from '@pui/portal';
import { PinchZoom } from './PinchZoom';
import { PinchZoomProvider } from '../contexts';

export const SeatImageViewerPortal: React.FC = ({ children }) => <Portal elementId="floating-root">{children}</Portal>;

interface SeatImageViewerProps {
  imageOverlayRef: RefObject<HTMLDivElement>;
  imageData: {
    path: string | null;
    blurHash: string | null;
  };
}

export const SeatImageViewer = ({ imageOverlayRef, imageData }: SeatImageViewerProps) => {
  const handleCloseImageViwer = (event: MouseEvent) => {
    if (imageOverlayRef && imageOverlayRef.current && event.currentTarget === event.target) {
      // eslint-disable-next-line no-param-reassign
      imageOverlayRef.current.style.display = 'none';
    }
  };
  return (
    <SeatImageViewerPortal>
      <PinchZoomProvider>
        <WrapperStyled ref={imageOverlayRef} onClick={handleCloseImageViwer}>
          <PinchZoom>
            {imageData && imageData.path && <Image src={imageData.path} blurHash={imageData.blurHash} noFadeIn />}
          </PinchZoom>
        </WrapperStyled>
      </PinchZoomProvider>
    </SeatImageViewerPortal>
  );
};

const WrapperStyled = styled.div`
  position: fixed;
  display: none;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`;
