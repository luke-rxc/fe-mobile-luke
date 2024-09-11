import { createContext } from 'react';

export type PresetContextValue = {
  showFollowSnackBar: () => void;
  hideFollowSnackBar: () => void;
  scrollNavigationView: (id: number) => void;
};
export const PresetContext = createContext<PresetContextValue>({
  showFollowSnackBar: () => {},
  hideFollowSnackBar: () => {},
  scrollNavigationView: () => {},
});
