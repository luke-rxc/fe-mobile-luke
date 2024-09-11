import React, { useState, createRef, createContext } from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';
import { nanoid } from '@utils/nanoid';
import { SnackbarPortal } from './SnackbarPortal';
import { Snackbar, SnackbarProps } from './Snackbar';

export interface SnackbarProviderProps {
  children: React.ReactNode;
}

export interface SnackbarActiveListProps {
  props: SnackbarProps;
  id: string;
}

export const SnackbarContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addSnackbar: (props: SnackbarProps) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeSnackbar: (id: string) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeAllSnackbar: () => {},
});

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [activeSnackbar, setActiveSnackbar] = useState<SnackbarActiveListProps[]>([]);
  const addSnackbar = (props: SnackbarProps) => {
    const id = nanoid();
    setActiveSnackbar((snackbar: SnackbarActiveListProps[]) => {
      return [...snackbar, { props, id }];
    });
  };

  const removeSnackbar = (id: string) => {
    setActiveSnackbar((snackbar: SnackbarActiveListProps[]) => {
      return snackbar.filter((snackbarItem: SnackbarActiveListProps) => snackbarItem.id !== id);
    });
  };

  const removeAllSnackbar = () => {
    setActiveSnackbar([]);
  };

  return (
    <SnackbarContext.Provider value={{ addSnackbar, removeSnackbar, removeAllSnackbar }}>
      {children}
      <SnackbarPortal>
        <TransitionGroup component={null}>
          {activeSnackbar.map((snackbarItem: SnackbarActiveListProps) => {
            const nodeRef = createRef<HTMLDivElement>();
            const { props, id } = snackbarItem;
            const { fadeTime, ...snackbarProps } = props;
            const fadeBaseTime = fadeTime ?? 250;
            return (
              <Transition appear key={id} mountOnEnter timeout={fadeBaseTime} unmountOnExit nodeRef={nodeRef}>
                {(transitionState) => {
                  return (
                    <Snackbar
                      {...snackbarProps}
                      fadeTime={fadeBaseTime}
                      snackbarId={id}
                      transitionState={transitionState}
                    />
                  );
                }}
              </Transition>
            );
          })}
        </TransitionGroup>
      </SnackbarPortal>
    </SnackbarContext.Provider>
  );
};
