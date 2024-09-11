/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, forwardRef, createElement, useMemo } from 'react';
import styled, { StyledComponent, DefaultTheme } from 'styled-components';
import isObject from 'lodash/isObject';
import { v4 as uuid } from 'uuid';

type ToRequired<T> = {
  [P in keyof T]-?: T[P];
};

type PickFunctionProperty<
  T,
  // eslint-disable-next-line @typescript-eslint/ban-types
  O = T extends {} ? ToRequired<T> : Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  F = { [key in keyof O]: O[key] extends Function ? key : '' },
  K = Exclude<F[keyof F], ''>,
> = Pick<T, K extends keyof T ? K : never>;

type ListElement = HTMLUListElement | HTMLOListElement | HTMLDivElement | HTMLSpanElement;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SourceType = Record<string, any> | number | string;

export interface ListProps<S extends SourceType = SourceType> extends React.HTMLAttributes<ListElement> {
  is?: 'ul' | 'ol' | 'div' | 'span';
  source?: S[];
  component?:
    | (JSX.IntrinsicAttributes & React.ComponentType<S>)
    | StyledComponent<React.ComponentType<S>, DefaultTheme>;
  render?: (source: S, index: number) => React.ReactNode;
  getKey?: (source: S, index: number) => string;
  /**
   * @beta getHandlers의 반환값이 제네릭타입의 nested한 object value로 타입추론이 완벽하지 않음
   */
  getHandlers?: (source: S, index: number) => Partial<PickFunctionProperty<S>>;
}

/**
 * List Component
 */
export const List = styled(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  forwardRef<unknown, ListProps>(
    ({ is = 'ul', source, component: Component, render, getKey, getHandlers, children, ...props }, ref) => {
      /**
       * data(source)를 참조하여 리스트 아이템에 전달할 key값 생성
       */
      const getItemKey = (item: SourceType, index: number): string => {
        return getKey ? getKey(item, index) : uuid().slice(0, 8);
      };

      /**
       * 이벤트 핸들러 생성
       */
      const getItemHandlers = (item: SourceType, index: number): Partial<PickFunctionProperty<SourceType>> => {
        return getHandlers ? getHandlers(item, index) : {};
      };

      /**
       * component props를 통해 ChildNode를 생성
       */
      const ComponentNode = useMemo(() => {
        if (!source || !Component) {
          return null;
        }

        return source?.map((item, index) =>
          isObject(item) ? (
            <Component key={getItemKey(item, index)} {...item} {...getItemHandlers(item, index)} />
          ) : (
            <Component key={getItemKey(item, index)}>{item}</Component>
          ),
        );
      }, [source, Component, getKey]);

      /**
       * render props를 통해 ChildNode를 생성
       */
      const RenderNodes = useMemo(() => {
        if (!source || !render) {
          return null;
        }

        return source?.map((item, index) => (
          <Fragment key={getItemKey(item, index)}>
            {isObject(item) ? render({ ...item, ...getItemHandlers(item, index) }, index) : render(item, index)}
          </Fragment>
        ));
      }, [source, render, getKey]);

      return createElement(is, { ...props, ref }, [children, ComponentNode, RenderNodes]);
    },
  ),
)`` as (<T extends SourceType = SourceType>(
  props: ListProps<T> & { ref?: React.ForwardedRef<ListElement> },
) => ReturnType<React.ForwardRefExoticComponent<ListProps<T> & React.RefAttributes<ListElement>>>) &
  string;
