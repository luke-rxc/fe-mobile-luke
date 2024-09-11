import { useState, useEffect, useCallback } from 'react';

export const useMatchMedia = (media: string) => {
  const [isMatches, setIsMatches] = useState(typeof window !== 'undefined' ? window.matchMedia(media).matches : false);

  const handleChange = (evt: MediaQueryListEvent) => {
    setIsMatches(evt.matches);
  };

  const addListener = useCallback(() => {
    const mediaQuery = window.matchMedia(media);

    if (mediaQuery) {
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        mediaQuery.addListener(handleChange);
      }
    }
  }, [media]);

  const removeListener = useCallback(() => {
    const mediaQuery = window.matchMedia(media);

    if (mediaQuery) {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    }
  }, [media]);

  useEffect(() => {
    addListener();
    return () => removeListener();
  }, [media, addListener, removeListener]);

  return {
    isMatches,
    addListener,
    removeListener,
  };
};
