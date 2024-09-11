const fontFamily = 'SF Pro Display, -apple-system, Helvetica Neue, Helvetica, Arial, sans-serif';
const fontSize = {
  s10: '1rem',
  s12: '1.2rem',
  s14: '1.4rem',
  s15: '1.5rem',
  s18: '1.8rem',
  s20: '2rem',
  s24: '2.4rem',
  s32: '3.2rem',
};

const fontWeight = {
  regular: 400,
  bold: 700,
};

const fontType = {
  micro: `normal ${fontWeight.regular} ${fontSize.s10}/1.4rem ${fontFamily}`,
  microB: `normal ${fontWeight.bold} ${fontSize.s10}/1.4rem ${fontFamily}`,
  mini: `normal ${fontWeight.regular} ${fontSize.s12}/1.6rem ${fontFamily}`,
  miniB: `normal ${fontWeight.bold} ${fontSize.s12}/1.6rem ${fontFamily}`,
  small: `normal ${fontWeight.regular} ${fontSize.s14}/2rem ${fontFamily}`,
  smallB: `normal ${fontWeight.bold} ${fontSize.s14}/2rem ${fontFamily}`,
  medium: `normal ${fontWeight.regular} ${fontSize.s15}/1.79rem ${fontFamily}`,
  mediumB: `normal ${fontWeight.bold} ${fontSize.s15}/1.79rem ${fontFamily}`,
  large: `normal ${fontWeight.regular} ${fontSize.s18}/2.4rem ${fontFamily}`,
  largeB: `normal ${fontWeight.bold} ${fontSize.s18}/2.4rem ${fontFamily}`,
  title2: `normal ${fontWeight.regular} ${fontSize.s20}/2.387rem ${fontFamily}`,
  title2B: `normal ${fontWeight.bold} ${fontSize.s20}/2.387rem ${fontFamily}`,
  title: `normal ${fontWeight.regular} ${fontSize.s24}/2.864rem ${fontFamily}`,
  titleB: `normal ${fontWeight.bold} ${fontSize.s24}/2.864rem ${fontFamily}`,
  headline: `normal ${fontWeight.regular} ${fontSize.s32}/3.819rem ${fontFamily}`,
  headlineB: `normal ${fontWeight.bold} ${fontSize.s32}/3.819rem ${fontFamily}`,
};

export const contentStyle = {
  fontType,
};

export default contentStyle;
