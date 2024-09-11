interface EventProps {
  ref: React.RefObject<HTMLElement | null>;
  listener: () => void;
}

export const useTouchTap = () => {
  const handleTouchDisabled = (evt: TouchEvent) => {
    evt.cancelable && evt.preventDefault();
    evt.stopPropagation();
  };

  const addTapEvent = ({ ref, listener }: EventProps) => {
    if (ref.current) {
      ref.current.addEventListener('touchstart', handleTouchDisabled);
      ref.current.addEventListener('touchmove', handleTouchDisabled);
      ref.current.addEventListener('touchend', listener);
    }
  };

  const removeTapEvent = ({ ref, listener }: EventProps) => {
    if (ref.current) {
      ref.current.removeEventListener('touchstart', handleTouchDisabled);
      ref.current.removeEventListener('touchmove', handleTouchDisabled);
      ref.current.removeEventListener('touchend', listener);
    }
  };

  return {
    addTapEvent,
    removeTapEvent,
  };
};
