/**
 * 화면 가로모드 여부
 */
export const getIsPortait = () => {
  if (window.screen.orientation) {
    const { angle } = window.screen.orientation;

    return angle === 0 || angle === 180;
  }

  return window.matchMedia('(orientation: portrait)').matches;
};
