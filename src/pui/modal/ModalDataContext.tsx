import { CallWebTypes } from '@constants/webInterface';
import { parsePayload } from '@utils/web2App';
import { createContext, useEffect, useState } from 'react';

export interface ModalDataContextProps {
  modalId: string;
  prevId?: string;
  children: React.ReactNode;
}

export interface ModalDataProviderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  receiveValues: Record<string, any>;
  modalId: string;
  prevId?: string;
}

const initial: ModalDataProviderProps = {
  initialValues: {},
  receiveValues: {},
  modalId: '',
  prevId: undefined,
};

function isAllowEvent(event: string) {
  const allowEvents = [CallWebTypes.InitialData, CallWebTypes.ReceiveData];
  return allowEvents.some((allowed) => event.includes(allowed));
}

export const ModalDataContext = createContext<ModalDataProviderProps>(initial);

export const ModalDataProvider = ({ modalId, prevId, children }: ModalDataContextProps) => {
  const [initialValues, setInitialValues] = useState(initial.initialValues);
  const [receiveValues, setReceiveValues] = useState(initial.receiveValues);

  useEffect(() => {
    function handler(event: MessageEvent<{ event: CallWebTypes; payload?: string }>) {
      const { origin, data } = event;

      if (origin !== window.location.origin) {
        return;
      }

      if (!(data.event && isAllowEvent(data.event))) {
        return;
      }

      const { event: command, payload: detail = '' } = data;

      switch (command) {
        case `${CallWebTypes.ReceiveData}_${modalId}`:
          setReceiveValues(parsePayload(detail));
          break;
        case `${CallWebTypes.InitialData}_${modalId}`:
          setInitialValues(parsePayload(detail));
          break;
        default:
          break;
      }
    }

    window.addEventListener('message', handler);

    return () => {
      window.removeEventListener('message', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModalDataContext.Provider value={{ modalId, prevId, initialValues, receiveValues }}>
      {children}
    </ModalDataContext.Provider>
  );
};
