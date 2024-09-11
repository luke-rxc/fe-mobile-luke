/**
 * Pinch Zoom Content (Image)들의 zIndex 를 통합적으로 관리하기 위한 Context
 */
import { createContext, useContext, useState, ReactNode } from 'react';

interface PinchZoomContextValue {
  zIndex: number;
  updateIndex: () => void;
}

interface PinchZoomProviderProps {
  children?: ReactNode;
}

const PinchZoomContext = createContext<PinchZoomContextValue>({} as PinchZoomContextValue);

/** Provider */
export const PinchZoomProvider = ({ children }: PinchZoomProviderProps) => {
  const [zIndex, setZIndex] = useState(0);

  const updateIndex = (): void => {
    setZIndex((prev) => prev + 1);
  };

  return (
    <PinchZoomContext.Provider
      value={{
        zIndex,
        updateIndex,
      }}
    >
      {children}
    </PinchZoomContext.Provider>
  );
};

/** Hook */
export const usePinchZoom = (): PinchZoomContextValue => useContext(PinchZoomContext);
