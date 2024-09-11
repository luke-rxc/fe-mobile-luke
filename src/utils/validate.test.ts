import { isAlpha, isCellPhone, isEmail, isLowerAlpha, isSpace, isTel } from './validate';

describe('validate', () => {
  describe('isSpace', () => {
    it('입력한 문자열에 공백이 있는지 체크한다', () => {
      const act = isSpace('공백 체크');
      expect(act).toBe(true);
    });
  });

  describe('isAlpha', () => {
    it('입력한 문자열에 알파벳 체크한다', () => {
      const act = isAlpha('TDD');
      expect(act).toBe(true);
    });
  });

  describe('isLowerAlpha', () => {
    it('알파벳(소문자) 체크한다', () => {
      const act = isLowerAlpha('a');
      expect(act).toBe(true);
    });
  });

  describe('isEmail', () => {
    it('Email 체크한다', () => {
      const act = isEmail('jeff@rxc.co.kr');
      expect(act).toBe(true);
    });
  });

  describe('isCellPhone', () => {
    it('휴대폰 검증을 체크한다', () => {
      const act = isCellPhone('01012345678');
      expect(act).toBe(true);
    });
  });

  describe('isTel', () => {
    it('일반전화번호 검증한다', () => {
      const act = isTel('0216441300', false);
      expect(act).toBe(true);
    });

    it('일반전화번호 혹은 휴대폰 번호를 검증한다', () => {
      const act = isTel('01012345678');
      expect(act).toBe(true);
    });
  });
});
