/**
 * 화면 Display 사이즈 체크
 */
const getDisplaySize = () => {
  const w = window;
  const d = document;
  const e = d.documentElement;
  const g = d.getElementsByTagName('body')[0];
  const x = w.innerWidth || e.clientWidth || g.clientWidth;
  const y = w.innerHeight || e.clientHeight || g.clientHeight;

  return {
    width: x,
    height: y,
  };
};

export const displaySize = getDisplaySize();

/**
 * 현재 가로사이즈에 맞게 내려온 width, height 를 비율에 맞는 수치로 변환
 */
export const getRatio = (width: number | null, height: number | null) => {
  if (width === null || height === null || width === 0 || height === 0) {
    return {
      width: null,
      height: null,
    };
  }

  const { width: displayWidth } = displaySize;
  const ratioHeight = displayWidth * (height / width);

  return {
    width: displayWidth,
    height: ratioHeight,
  };
};
