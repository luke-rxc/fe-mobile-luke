import { RefObject, useLayoutEffect, useState } from 'react';

/**
 * useElementSize
 *
 * element의 width height 정보 hook
 */
export const useElementSize = (ref?: RefObject<HTMLDivElement>, depsFlag = false) => {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    function updateSize() {
      if (ref) {
        if (ref.current !== null) {
          setSize([ref.current.getBoundingClientRect().width, ref.current.getBoundingClientRect().height]);
        }
      } else {
        setSize([window.innerWidth, window.innerHeight]);
      }
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => {
      window.removeEventListener('resize', updateSize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsFlag]);

  return size;
};
