import { nanoid } from '@utils/nanoid';
import { useState } from 'react';

export type ReturnTypeUseDrawerStatus = ReturnType<typeof useDrawerStatus>;

interface OpenInfo {
  opened: boolean;
  openValue: string | null;
}

export const useDrawerStatus = () => {
  const [openInfo, setOpenInfo] = useState<OpenInfo>({
    opened: false,
    openValue: null,
  });

  const handleUpdateOpened = (opened: boolean) => {
    setOpenInfo((prev) => {
      if (prev.opened !== opened) {
        return { opened, openValue: opened ? nanoid(8) : null };
      }

      return prev;
    });
  };

  return { ...openInfo, handleUpdateOpened };
};
