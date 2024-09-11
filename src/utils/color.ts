import toNumber from 'lodash/toNumber';

/**
 * Hex 색상여부 확인
 */
export const isHexColor = (hexCode: string): boolean => {
  return /^#([a-f0-9]{3,4}|[a-f0-9]{4}(?:[a-f0-9]{2}){1,2})\b$/i.test(hexCode);
};

/**
 * RGBA(RGB) 색상여부 확인
 */
export const isRGBA = (rgbaCode: string): boolean => {
  const regex = /(rgb)a?\((\s*\d+%?\s*?,?\s*){2}(\s*\d+%?\s*?,?\s*\)?)(\s*,?\s*\/?\s*(0?\.?\d+%?\s*)?|1|0)?\)$/i;
  return !!rgbaCode && regex.test(rgbaCode);
};

/**
 * Hex코드를 RGBA코드로 변환
 */
export const convertHexToRGBA = (hexCode: string, opacity = 1) => {
  let color = hexCode;

  if (isRGBA(color)) {
    color = convertRGBAToHex(color);
  }

  if (!isHexColor(color)) {
    return '';
  }

  let hex = color.replace('#', '');
  let alpha = opacity;

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  if (alpha > 1 && alpha <= 100) {
    alpha /= 100;
  }

  return `rgba(${r},${g},${b},${alpha})`;
};

/**
 * RGBA(RGB)코드를 Hex코드로 변환
 */
export const convertRGBAToHex = (rgbaCode: string) => {
  if (!isRGBA(rgbaCode)) {
    return '';
  }

  const regex = /rgba?\(|\)/gi;
  const [r, g, b] = rgbaCode.replaceAll(regex, '').split(',');

  const padZero = (str: string) => {
    return str.length === 1 ? `0${str}` : str;
  };

  return [
    '#',
    padZero(toNumber(r).toString(16)),
    padZero(toNumber(g).toString(16)),
    padZero(toNumber(b).toString(16)),
  ].join('');
};
