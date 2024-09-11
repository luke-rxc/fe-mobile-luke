import type { HTMLAttributes } from 'react';
import type { AppearType } from '../constants';
import { ScrollTriggerModel } from './Presets';

/**
 * 박스 모션 타입
 */
export type AppearBoxProps = ScrollTriggerModel & {
  className?: string;
  appear?: AppearType; // 등장 모션
  delay?: number; // 애니메이션 딜레이
};

export type AppearStyledProps = Pick<AppearBoxProps, 'appear' | 'delay'>;

export type AppearTransitionProps = HTMLAttributes<HTMLDivElement> & {
  /**  트랜지션 여부 */
  transition?: boolean;
  /** 애니메이션 */
  transitionTime?: number;
};
