/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useUpdateEffect } from 'react-use';
import { FloatingIdType, FloatingRenderType } from '../types';
import { useFloating, UseFloatingOptionsType } from '../hooks';

export type FloatingProps = Omit<UseFloatingOptionsType, 'enabled'> & {
  children: FloatingRenderType;
  id?: FloatingIdType;
  floating?: boolean;
};

export const Floating: React.FC<FloatingProps> = ({ floating, id, children, defaultVisible, ...options }) => {
  const floatingId = useMemo(() => id ?? uuid().slice(0, 8), [id]);
  const { show, hide } = useFloating(floatingId, children, { defaultVisible, ...options });

  useUpdateEffect(() => {
    floating ? show() : hide();
  }, [floating]);

  return null;
};
