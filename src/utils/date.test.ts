import { toDateFormat } from './date';

describe('date', () => {
  describe('toDateFormat', () => {
    // 2020-05-24 13:30:30.111
    const date = new Date(2022, 4, 24, 13, 30, 30, 111);
    const timestamp = date.getTime();

    describe('기본 날짜 형식 "yyyy/MM/dd HH:mm"', () => {
      it('Timestamp 타입을 포맷에 맞게 반환해야 한다', () => {
        const result = toDateFormat(date);
        expect(result).toBe('2022/05/24 13:30');
      });

      it('Date 타입를 포맷에 맞게 반환해야 한다', () => {
        const result = toDateFormat(timestamp);
        expect(result).toBe('2022/05/24 13:30');
      });

      it('UTC 기준값을 반환해야 한다', () => {
        const result = toDateFormat(new Date(0));
        expect(result).toBe('1970/01/01 09:00');
      });
    });

    it('지정한 형식의 날짜 포맷으로 반환해야 한다', () => {
      const result = [];
      result.push(toDateFormat(date, 'yyyy-M-d HH:mm:ss'));
      result.push(toDateFormat(timestamp, 'yyyy-MM-dd HH:mm:ss'));

      expect(result).toEqual(['2022-5-24 13:30:30', '2022-05-24 13:30:30']);
    });

    it.todo('format의 options를 사용할 수 있어야 한다');
  });
});
