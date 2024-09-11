import { useEffect, useState } from 'react';

export const useToggle = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleToggleOpen = () => {
    setOpen((prev) => {
      return !prev;
    });
  };

  useEffect(() => {
    return () => {
      setOpen(false);
    };
  }, []);

  return { open, handleToggleOpen };
};
