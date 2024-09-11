import type { HTMLAttributes } from 'react';

export type AppearTransitionProps = HTMLAttributes<HTMLDivElement> & {
  /**  트랜지션 여부 */
  transition?: boolean;
  /** 애니메이션 */
  transitionTime?: number;
};
