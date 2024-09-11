import { createContext, useCallback, useEffect, useState } from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { uid } from '@utils/nanoid';

interface WebEventContextProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageshow: Record<string, any>;
  mWebPageId: string | null;
}

interface WebEventProviderProps {
  children: JSX.Element[] | JSX.Element;
}

export const WebEventContext = createContext<WebEventContextProps>({
  pageshow: {},
  mWebPageId: null,
});

export const WebEventProvider = ({ children }: WebEventProviderProps) => {
  const { isApp } = useDeviceDetect();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pageshow, setPageShow] = useState<Record<string, any>>({});
  const [mWebPageId, setMWebPageId] = useState<string | null>(null);

  const handleEvent = useCallback((event: Event) => {
    const { type } = event;

    switch (type) {
      case 'pageshow':
        if (!isApp) {
          setMWebPageId(uid());
        }
        setPageShow(event);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener('pageshow', handleEvent);

    return () => {
      window.removeEventListener('pageshow', handleEvent);
    };
  }, [handleEvent]);

  return <WebEventContext.Provider value={{ pageshow, mWebPageId }}>{children}</WebEventContext.Provider>;
};
