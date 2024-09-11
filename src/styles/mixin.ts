import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';

type Direction = {
  r?: string | number;
  t?: string | number;
  b?: string | number;
  l?: string | number;
};

export const zIndex =
  <T extends { [key: string]: number }>(reference: T) =>
  (location: keyof T, level = 0) => {
    return `z-index: ${reference[location] + level};`;
  };

export const ellipsis = () => {
  return `
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `;
};

export const multilineEllipsis = (line: number, lineHeight: number | string) => {
  let height: number;
  let unit: string;

  if (isString(lineHeight)) {
    height = parseFloat(lineHeight);
    unit = lineHeight.match(/([a-zA-Z])\w+/g)?.[0] || '';
  } else {
    height = lineHeight / 10;
    unit = 'rem';
  }

  return `
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${line};
    line-height: ${height}${unit} !important;
    max-height: ${line * height}${unit};
  `;
};

export const position = (pos: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed', direction?: Direction) => {
  const { t, r, b, l } = direction || {};
  const convert = (num: number | string) => {
    return isString(num) ? num : `${num / 10}rem`;
  };

  return `
    position: ${pos};
    ${isUndefined(t) ? '' : `top: ${convert(t)}`};
    ${isUndefined(r) ? '' : `right: ${convert(r)}`};
    ${isUndefined(b) ? '' : `bottom: ${convert(b)}`};
    ${isUndefined(l) ? '' : `left: ${convert(l)}`};
  `;
};

export const relative = (direction?: Direction) => {
  return position('relative', direction);
};

export const absolute = (direction?: Direction) => {
  return position('absolute', direction);
};

export const fixed = (direction?: Direction) => {
  return position('fixed', direction);
};

/**
 * 한중일 줄 바꿈 처리
 *
 * DOM의 구조 및 CSS 속성에 따라 width가 필요할 수 있습니다.
 */
export const wordBreak = () => {
  return `
    word-break: keep-all;
    overflow-wrap: break-word;
    overflow-wrap: anywhere;
  `;
};

/**
 * 부모(relative)요소를 기준으로 center 정렬
 * @param transform
 */
export const center = (transform?: string) => {
  return `
    ${absolute({ t: '50%', l: '50%' })}
    transform: translate3d(-50%, -50%, 0) ${transform || ''};
`;
};

/**
 * 자식 요소의 center 정렬
 * @param inline 컨테이너의 inline element 여부
 */
export const centerItem = (inline?: boolean) => {
  return `
    display: ${inline ? 'inline-flex' : 'flex'};
    align-items: center;
    justify-content: center;
`;
};

/**
 * iOS Notch 영역(safe-area) 여백 처리
 * @param {string} property 속성값 (top | bottom | padding-top | padding-bottom)
 * @param {number} value calc() 함수를 통해 더해질 값
 */
export const safeArea = (property: 'top' | 'bottom' | 'padding-top' | 'padding-bottom', value?: number) => {
  const convert = (num: number) => {
    return isUndefined(num) ? '' : `${num / 10}rem`;
  };

  if (property.includes('padding')) {
    const splitProperty = property.split('-')[1];
    if (value && value > 0) {
      return `
        ${property}: calc(env(safe-area-inset-${splitProperty}) + ${convert(value)});
      `;
    }
    return `
      ${property}: env(safe-area-inset-${splitProperty});
    `;
  }
  if (value && value > 0) {
    return `
      ${property}: calc(env(safe-area-inset-${property}) + ${convert(value)});
    `;
  }
  return `
    ${property}: env(safe-area-inset-${property});
  `;
};
