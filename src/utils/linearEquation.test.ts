import { linearEquation } from '@utils/linearEquation';

describe('linearEquation', () => {
  it('기준 범위내의 값을, 기대 범위내 값에 비례한 값으로 조회한다.', () => {
    const value = linearEquation(50, 0, 100, 0, 1);
    expect(value).toBe(0.5);
  });
  it('기준 범위내의 종료값보다 값이 큰 경우, 기대 범위의 종료값으로 조회한다.', () => {
    const value = linearEquation(200, 0, 100, 0, 1);
    expect(value).toBe(1);
  });
  it('기준 범위내의 시작값보다 값이 작은 경우, 기대 범위의 시작값으로 조회한다.', () => {
    const value = linearEquation(-50, 0, 100, 0, 1);
    expect(value).toBe(0);
  });
});
