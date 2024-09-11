import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SignUser } from '../types';

type HistoryStateProps = Omit<SignUser, 'name'> & { nickname?: string };

export const useSignUser = () => {
  const [user, setUser] = useState<SignUser | null>(null);
  const { state } = useLocation<HistoryStateProps>();

  useEffect(() => {
    if (state) {
      const { method, email, profileImageUrl, type, nickname: name, isAdAgree, ...rest } = state;

      setUser((prev) => {
        if (!prev) {
          return {
            ...rest,
            method,
            type,
            email,
            profileImageUrl,
            name,
            isAdAgree,
          };
        }

        return prev;
      });
    }
  }, [state]);

  return { user };
};
