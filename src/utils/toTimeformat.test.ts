import { toTimeformat, toMMSS, toHHMMSS } from './toTimeformat';

describe('toTimeformat', () => {
  // 2020-05-24 13:30:30.111
  const timestamp = new Date(2022, 4, 24, 13, 30, 30, 111).getTime();

  describe('toTimeformat', () => {
    it('0 또는 음수인 경우 각 시/분/초는 "00"으로 반환해야 한다', () => {
      const result = [];
      result.push(toTimeformat(0));
      result.push(toTimeformat(-1));

      const expected = [
        { hours: '00', minutes: '00', seconds: '00' },
        { hours: '00', minutes: '00', seconds: '00' },
      ];

      expect(result).toEqual(expected);
    });

    it('Milliseconds 단위의 숫자를 시/분/초 형태로 변환해야 한다', () => {
      const result = toTimeformat(timestamp);

      expect(Object.keys(result)).toEqual(['hours', 'minutes', 'seconds']);
      expect(typeof result.hours).toBe('string');
      expect(result.minutes).toHaveLength(2);
      expect(result.seconds).toHaveLength(2);
    });

    it('각 시/분/초는 10 미만인 경우 공백을 0으로 채운 두자리로 반환해야 한다', () => {
      // 32400(9h) + 540(9m)) + 9(9s) = 32949
      const result = toTimeformat(32949000);

      expect(result).toEqual({ hours: '09', minutes: '09', seconds: '09' });
    });
  });

  describe('toMMSS', () => {
    it('0 또는 음수인 경우 "00:00"을 반환한다', () => {
      const result = [];
      result.push(toMMSS(0));
      result.push(toMMSS(-1));

      expect(result).toEqual(['00:00', '00:00']);
    });

    it('시/밀리초를 제외한 분/초를 mm:ss 형태로 반환해야 한다', () => {
      const result = toMMSS(timestamp);

      expect(result).toBe('30:30');
    });

    it('1분 미만인 경우 00:ss 형태로 반환해야 한다', () => {
      const result = toMMSS(59000);

      expect(result).toBe('00:59');
    });
  });

  describe('toHHMMSS', () => {
    it('0 또는 음수인 경우 "00:00:00"을 반환한다', () => {
      const result = [];
      result.push(toHHMMSS(0));
      result.push(toHHMMSS(-1));

      expect(result).toEqual(['00:00:00', '00:00:00']);
    });

    /** @summary h는 자리수의 제한이 없음을 의미한다. */
    it('밀리초를 제외한 시/분/초를 h:mm:ss 형태로 반환해야 한다', () => {
      const result = toHHMMSS(timestamp);

      expect(result).toBe('459268:30:30');
    });

    it('1시간 미만인 경우 00:mm:ss 형태로 반환해야 한다', () => {
      // 3540(59m) + 59(59s) = 3599
      const result = toHHMMSS(3599000);

      expect(result).toBe('00:59:59');
    });

    it('1분 미만인 경우 00:00:ss 형태로 반환해야 한다', () => {
      const result = toHHMMSS(59000);

      expect(result).toBe('00:00:59');
    });
  });
});
