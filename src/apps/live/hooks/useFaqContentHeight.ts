import { useEffect, useRef, useState } from 'react';

/**
 * FAQ content height custom hook
 */
export const useFaqContentHeight = (content: string) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    return () => {
      setContentHeight(0);
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [content]);

  return { contentRef, contentHeight };
};
