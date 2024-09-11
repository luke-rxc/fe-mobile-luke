import { useCallback, useRef, useContext } from 'react';
import { CallWebTypes } from '@constants/webInterface';
import isEmpty from 'lodash/isEmpty';
import { nanoid } from '@utils/nanoid';
import { ModalDataContext } from '@pui/modal';
import { ModalContentProps, useModalStore } from '@stores/useModalStore';

export const useModal = () => {
  const getStatus = useModalStore((state) => state.getStatus);
  const mountContents = useModalStore((state) => state.mount);
  const open = useModalStore((state) => state.open);
  const close = useModalStore((state) => state.close);
  const latestDepth = useModalStore((state) => state.modalDepth);
  const { current: depth } = useRef(latestDepth);
  const { modalId, prevId } = useContext(ModalDataContext);

  const handleOpen = (props: ModalContentProps) => {
    const id = nanoid();
    return new Promise<string>((resolve) => {
      mountContents({ id, fn: () => resolve(id) });
      open(props, id);
    });
  };

  const openModal = async (props: ModalContentProps, data?: Record<string, unknown>) => {
    const id = await handleOpen(props);
    !isEmpty(data) && emit(`${CallWebTypes.InitialData}_${id}`, data);
    return Promise.resolve(id);
  };

  const closeModal = (id: string, data?: Record<string, unknown>) => {
    const mId = id || modalId;
    if (mId) {
      close(mId);
      const event = prevId ? `${CallWebTypes.ReceiveData}_${prevId}` : CallWebTypes.ReceiveData;
      !isEmpty(data) && emit(event, data);
    }
  };

  const emit = useCallback(<T>(type: string, payload: T) => {
    window.postMessage({ event: type, payload: JSON.stringify(payload) }, window.location.origin);
  }, []);

  const isModalView = () => {
    return depth > 0;
  };

  return {
    openModal,
    closeModal,
    latestDepth,
    depth,
    isModalView,
    getStatus,
  };
};
