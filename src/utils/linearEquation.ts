/**
 * 기준이 되는 Range의 현재 '진행도'를 기준으로
 * 기대값의 Range 내에서 같이 '진행도'를적용하여 기대값의 현재 상태값을 구한다.
 * @param  {number} current 현재 값
 * @param  {number} base 시작 값
 * @param  {number} finish 종료 값
 * @param  {number} expectBase 기대하는 Range의 시작 값
 * @param  {number} expectFinish 기대하는 Range의 종료 값
 * @return {number} 기대값의 현재 상태값
 *
 * @example
 *  - scrollValue 가 0 에서 56 까지 변할때, value는 0 에서 1까지 변한다.
 *  ---> const value = linearEquation(scrollValue, 0, 56, 0, 1)
 */

export const linearEquation = (
  current: number,
  base: number,
  finish: number,
  expectBase: number,
  expectFinish: number,
): number => {
  const result = ((expectFinish - expectBase) / (finish - base)) * (current - base) + expectBase;

  if (current >= finish) {
    return expectFinish;
  }

  return current <= base ? expectBase : result;
};
