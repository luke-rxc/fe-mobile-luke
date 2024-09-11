import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { RefObject, useRef, useState } from 'react';
import { useFullscreen } from 'react-use';

interface Props {
  enabled: boolean;
  videoRef: RefObject<HTMLVideoElement>;
}
export const useVideoFullscreen = ({ enabled, videoRef }: Props) => {
  const { isAndroid, isMobile } = useDeviceDetect();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useFullscreen(!isMobile || isAndroid ? videoRef : wrapperRef, fullscreen, {
    video: videoRef,
    onClose: () => {
      setFullscreen(false);
    },
  });

  const onClickFullscreen = () => {
    if (!enabled) {
      return;
    }
    setFullscreen(true);
  };

  return { wrapperRef, enabled, fullscreen, onClickFullscreen };
};
