import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { usePinchZoom } from '../contexts';

interface Props {
  children?: React.ReactNode;
}

export const PinchZoom = ({ children }: Props) => {
  const transFormRef = useRef<ReactZoomPanPinchRef>(null);
  const { zIndex, updateIndex } = usePinchZoom();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPanning, setIsPanning] = useState(false);
  const [zPosition, setZPosition] = useState<number>(zIndex ?? 0);
  const handleZoomStop = (pinchRef: ReactZoomPanPinchRef) => {
    const toPanning = pinchRef.state.scale > 1;
    if (!toPanning) {
      pinchRef.resetTransform(0);
    }
    setIsPanning(toPanning);
  };
  const handleWrapperStart = () => {
    setZPosition(zIndex + 1);
    updateIndex();
  };

  return (
    <Wrapper zPosition={zPosition}>
      <TransformWrapper
        ref={transFormRef}
        centerZoomedOut
        centerOnInit
        minScale={1}
        maxScale={3}
        initialScale={1}
        panning={{ excluded: ['video'] }}
        pinch={{ step: 3 }}
        doubleClick={{ mode: 'reset' }}
        wheel={{ disabled: true }}
        onZoomStop={handleZoomStop}
        onPinchingStart={handleWrapperStart}
        onPanningStart={handleWrapperStart}
      >
        <TransformComponent>{children}</TransformComponent>
      </TransformWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ zPosition: number }>`
  margin-top: auto;
  margin-bottom: auto;
  & .react-transform-wrapper {
    overflow: initial !important;
    z-index: ${({ zPosition }) => zPosition};

    .react-transform-component {
      will-change: transform !important;
    }
  }
`;
