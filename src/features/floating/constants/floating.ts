import { FloatingRootStateType, FloatingItemStateType } from '../types';

/**
 *Floating Root 상태
 */
export const FloatingRootState: { [key in FloatingRootStateType]: key } = {
  shown: 'shown',
  showing: 'showing',
  hidden: 'hidden',
  hiding: 'hiding',
  clearing: 'clearing',
} as const;

/**
 * Floating Item 상태
 */
export const FloatingItemState: { [key in FloatingItemStateType]: key } = {
  shown: 'shown',
  showing: 'showing',
  hidden: 'hidden',
  hiding: 'hiding',
  removing: 'removing',
} as const;
