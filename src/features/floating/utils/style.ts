import isFunction from 'lodash/isFunction';
/**
 *
 */
export const setStyles = (element: HTMLElement, style: React.CSSProperties) => {
  Object.assign(element.style, style);
};

/**
 *
 */
export const setStylesWithStep = (
  element: HTMLElement,
  styles: (React.CSSProperties | (() => React.CSSProperties))[],
) => {
  if (styles.length) {
    window.requestAnimationFrame(() => {
      const [style, ...rest] = styles;
      setStyles(element, isFunction(style) ? style() : style);
      setStylesWithStep(element, rest);
    });
  }
};
