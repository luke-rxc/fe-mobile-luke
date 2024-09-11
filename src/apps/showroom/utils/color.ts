import { RefObject } from 'react';
import { convertHexToRGBA } from '@utils/color';
import { ShowroomColor } from '../types';

/**
 * CSS Property 정의
 */
export const setColor = (ref: RefObject<HTMLElement>, colorsValue: ShowroomColor) => {
  ref.current?.style.setProperty('--backgroundColor', colorsValue.backgroundColor || null);
  ref.current?.style.setProperty('--contentColor', colorsValue.contentColor || null);
  ref.current?.style.setProperty('--tintColor', colorsValue.tintColor);
  ref.current?.style.setProperty('--textColor', colorsValue.textColor);

  // TitleSection의 더보기 버튼 텍스트 색상
  ref.current?.style.setProperty(
    '--sectionMoreTextColor',
    colorsValue.contentColor ? convertHexToRGBA(colorsValue.contentColor, 0.5) : '',
  );
  // TitleSection의 더보기 버튼 pressedCell 색상
  ref.current?.style.setProperty(
    '--sectionMorePressedColor',
    colorsValue.contentColor ? convertHexToRGBA(colorsValue.contentColor, 0.03) : '',
  );
};

/**
 * CSS Property로 정의한 변수를 반환
 */
export const getColor = (color: keyof ShowroomColor | 'sectionMoreTextColor' | 'sectionMorePressedColor') => {
  return `var(--${color})`;
};
