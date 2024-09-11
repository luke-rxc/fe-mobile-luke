import { useContext } from 'react';
import { SnackbarProps, SnackbarContext } from '@pui/snackbar';

export const useSnackbar = () => {
  const {
    addSnackbar: handleAddSnackbar,
    removeSnackbar: handleRemoveSnackbar,
    removeAllSnackbar: handleRemoveAllSnackbar,
  } = useContext(SnackbarContext);
  const addSnackbar = (props: SnackbarProps) => {
    handleAddSnackbar(props);
  };
  const removeSnackbar = (id: string) => {
    handleRemoveSnackbar(id);
  };
  const removeAllSnackbar = () => {
    handleRemoveAllSnackbar();
  };

  return {
    addSnackbar,
    removeSnackbar,
    removeAllSnackbar,
  };
};
