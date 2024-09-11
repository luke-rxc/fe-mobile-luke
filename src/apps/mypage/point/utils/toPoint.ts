export const toPoint = (point: number, signDisplay?: boolean): string => {
  if (point === 0) {
    return '0';
  }

  return point.toLocaleString('ko-KR', { signDisplay: signDisplay ? 'always' : 'auto' });
};
