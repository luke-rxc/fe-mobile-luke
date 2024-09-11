import React from 'react';
import { MwebHeaderRef } from '@pui/mwebHeader';
import { BrandHeaderProps } from '../components/header/BrandHeader';
import { WebHeaderProps } from '../components/header/WebHeader';

/**
 * Header Type
 */
export type HeaderType = 'mweb' | 'brand';

/**
 * Header 공통 State
 */
export type HeaderBaseState = {
  enabled?: boolean;
  element?: MwebHeaderRef | null;
};

/**
 * Header State
 */
export type HeaderState =
  | Record<string, never>
  | (HeaderBaseState & WebHeaderProps & { type: 'mweb' })
  | (HeaderBaseState & BrandHeaderProps & { type: 'brand' });

/**
 * Header Dispatch
 */
export type HeaderDispatch = React.Dispatch<React.SetStateAction<HeaderState>>;
