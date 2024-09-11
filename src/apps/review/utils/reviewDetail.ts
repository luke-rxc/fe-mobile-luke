/**
 * 미디어 크롭 처리를 위한 높이 계산
 * @param w
 * @param h
 * @returns
 */
export const getMediaHeight = (w: number, h: number) => {
  const maxWidthRatio = 9 / 16;
  const maxHeightRatio = 16 / 9;
  const mediaRatio = h / w;
  let targetHeight = 0;

  if (w > h) {
    // 가로 형
    if (mediaRatio < maxWidthRatio) {
      targetHeight = window.innerWidth * maxWidthRatio;
    } else {
      targetHeight = window.innerWidth * mediaRatio;
    }
  } else if (w < h) {
    // 세로 형
    if (mediaRatio > maxHeightRatio) {
      targetHeight = window.innerWidth * maxHeightRatio;
    } else {
      targetHeight = window.innerWidth * mediaRatio;
    }
  } else {
    // 정사각
    targetHeight = window.innerWidth;
  }
  const value = Math.round((targetHeight / 10) * 10) / 10; // rem 단위
  return value;
};

export const easeOutSine = (time: number, duration: number) => {
  let t = time;
  t /= duration;
  return Math.sin((t * Math.PI) / 2);
};
