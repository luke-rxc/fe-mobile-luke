/**
 * 스크린 사이즈 설정
 *
 * https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
 */
export const setScreenSize = () => {
  const vh = window.innerHeight * 0.01;

  document.documentElement.style.setProperty('--vh', `${vh}px`);
};
