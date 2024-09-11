import { goodsDecrypt, goodsEncrypt } from './goodsEncrypt';

describe('goodsEncrypt', () => {
  describe('goodsEncrypt', () => {
    it('상품ID와, 쇼룸ID를 34진수로 인코딩하여 "y"구분자로 결합한다', () => {
      const act = goodsEncrypt(147, 1);
      expect(act).toBe('4by1');
    });

    it('쇼룸ID가 없는 경우 0이 기본값으로 적용된다', () => {
      const act = goodsEncrypt(147);
      expect(act).toBe('4by0');
    });
  });

  describe('goodsDecrypt', () => {
    it('인코딩된 코드를 goodsId, showRoomId로 디코딩한다 ', () => {
      const act = goodsDecrypt('4by1');
      expect(act).toEqual({ goodsId: 147, showRoomId: 1 });
    });
  });
});
