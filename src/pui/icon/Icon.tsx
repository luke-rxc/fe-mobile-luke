import get from 'lodash/get';
import styled from 'styled-components';
import { forwardRef } from 'react';
import { Theme } from '@styles/theme';

/** 하위 뎁스를 .으로 연결 {a: {b: string}} => 'a.b' */
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

/** Nested한 구조의 값의 키를 추론하기위한 유틸타입 */
type NestedKey<T, P extends string | number = ''> = {
  [K in keyof T]: T[K] extends Record<string, unknown> ? Join<K, NestedKey<T[K], P>> : Join<K, P>;
}[keyof T];

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height' | 'children'> {
  /** SVG Element */
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  /** 아이콘 사이즈 */
  size?: string;
  /** 아이콘 최소 사이즈 */
  minSize?: string;
  /** 아이콘 최대 사이즈 */
  maxSize?: string;
  /** 아이콘 테마 색상(theme color) */
  color?: NestedKey<Theme['color']>;
  /** 아이콘 커스텀 색상(custom color / color props보다 우선순위 높음) */
  colorCode?: string;
}

const IconComponent = forwardRef<SVGSVGElement, IconProps>(
  ({ size, minSize, maxSize, color, colorCode, icon: SVGIcon, children, ...props }, ref) => {
    return <SVGIcon ref={ref} {...props} />;
  },
);

/**
 * Figma Iconography(SVG) 마스터 컴포넌트
 */
export const Icon = styled(IconComponent)`
  ${({ size }) => size && `width: ${size}; height: ${size};`}
  ${({ minSize }) => minSize && `min-width: ${minSize}; min-height: ${minSize};`}
  ${({ maxSize }) => maxSize && `max-width: ${maxSize}; max-height: ${maxSize};`}
  ${({ theme, color, colorCode }) => `color: ${colorCode || (color ? get(theme.color, color, 'inherit') : 'inherit')}`};

  & *[fill] {
    fill: currentColor;
  }
  & *[stroke] {
    stroke: currentColor;
  }
`;
