import styled from 'styled-components';
import isString from 'lodash/isString';
import classnames from 'classnames';
import { forwardRef, createElement } from 'react';
import { useDeviceDetect } from '@hooks/useDeviceDetect';

export interface DividerProps extends Omit<React.HTMLAttributes<React.ReactHTML>, 'children'> {
  /** padding top (default: 0rem) */
  t?: number | string;
  /** padding bottom (default: 0rem) */
  b?: number | string;
  /** padding left (default: 2.4rem) */
  l?: number | string;
  /** padding right (default: 2.4rem) */
  r?: number | string;
  /** 렌더시 사용될 태그 (default: span) */
  is?: keyof React.ReactHTML;
  /** divider type (default: line) */
  type?: 'line' | 'section';
}
const DividerComponent = forwardRef<HTMLElement, DividerProps>(
  ({ t, b, l, r, className, is = 'span', type = 'line', ...props }, ref) => {
    const { isIOS, isAndroid, isMobile } = useDeviceDetect();

    return createElement(is, {
      className: classnames(className, {
        'is-ios': isIOS,
        'is-and': isAndroid || !isMobile,
        'is-section': type === 'section',
      }),
      ref,
      ...props,
    });
  },
);

/**
 * Figma의 Divider 마스터 컴포넌트 - 가로 선 표현
 */
export const Divider = styled(DividerComponent)`
  display: block;
  padding-top: ${({ t = '0rem' }) => (isString(t) ? t : `${t}rem`)};
  padding-bottom: ${({ b = '0rem' }) => (isString(b) ? b : `${b}rem`)};
  padding-left: ${({ l = '2.4rem' }) => (isString(l) ? l : `${l}rem`)};
  padding-right: ${({ r = '2.4rem' }) => (isString(r) ? r : `${r}rem`)};

  &:after {
    display: block;
    background-color: ${({ theme }) => theme.color.backgroundLayout.line};
    content: '';
  }

  &.is-and {
    &:after {
      height: 0.1rem;
    }
  }

  &.is-ios {
    &:after {
      height: 0.05rem;
    }
  }

  &.is-section {
    padding: 0;
    &:after {
      height: 1.2rem;
      background-color: ${({ theme }) => theme.color.backgroundLayout.section};
    }
  }
`;
