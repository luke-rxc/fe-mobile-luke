const handleTouchMoveDisabled = (evt: TouchEvent) => {
  evt.cancelable && evt.preventDefault();
};

export const enabledBodyScroll = () => {
  window.removeEventListener('touchmove', handleTouchMoveDisabled);
};

export const disabledBodyScroll = () => {
  window.addEventListener('touchmove', handleTouchMoveDisabled, {
    passive: false,
  });
};
