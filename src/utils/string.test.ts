import { digit, formatToAmount, rn2br } from './string';

describe('string', () => {
  describe('formatToAmount', () => {
    it('입력한 숫자에 세자리 마다 콤마를 찍어야 한다', () => {
      const act = formatToAmount(10000);
      expect(act).toBe('10,000');
    });
  });

  describe('rn2br', () => {
    it('\\r\\n 를 br 태그로 치환해야 한다', () => {
      const act = rn2br('처리하시겠습니까?\r\n확인을 눌러주세요.');
      expect(act).toBe('처리하시겠습니까?<br/>확인을 눌러주세요.');
    });

    it('\\n\\r 를 br 태그로 치환해야 한다', () => {
      const act = rn2br('처리하시겠습니까?\n\r확인을 눌러주세요.');
      expect(act).toBe('처리하시겠습니까?<br/>확인을 눌러주세요.');
    });

    it('\\r 를 br 태그로 치환해야 한다', () => {
      const act = rn2br('처리하시겠습니까?\r확인을 눌러주세요.');
      expect(act).toBe('처리하시겠습니까?<br/>확인을 눌러주세요.');
    });

    it('\\n 를 br 태그로 치환해야 한다', () => {
      const act = rn2br('처리하시겠습니까?\n확인을 눌러주세요.');
      expect(act).toBe('처리하시겠습니까?<br/>확인을 눌러주세요.');
    });
  });

  describe('digit', () => {
    it('10 미만은 앞에 0을 붙이고 리턴해야 한다', () => {
      const act = digit(5);
      expect(act).toBe('05');
    });

    it('10 이상은 그대로 리턴해야 한다', () => {
      const act = digit(10);
      expect(act).toBe('10');
    });
  });
});
