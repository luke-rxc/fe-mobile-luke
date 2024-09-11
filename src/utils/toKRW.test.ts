import { toKRW } from './toKRW';

describe('toKRW', () => {
  it('"원" 표기법으로 변환되어야 한다', () => {
    const act = toKRW(1);
    expect(act).toBe('1원');
  });

  it('1000이상부터 세 자리마다 콤마가 붙어야 한다', () => {
    const act = toKRW(1000000);
    expect(act).toBe('1,000,000원');
  });

  it('999이하는 콤마가 붙지 않는다', () => {
    const act = toKRW(100);
    expect(act).not.toEqual(expect.stringMatching(/,/));
  });
});
