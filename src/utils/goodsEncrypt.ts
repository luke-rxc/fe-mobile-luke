/**
 * @description 쇼룸아이디와 상품아이디 숫자 코드를 직접적으로 노출 하지 않기 위해 인코딩 하여 사용
 *  - 34진수를 기반으로 진행
 *  - PageId 내에서 구분이 가능한 구분자는 'y' (34진수로 추출이 안됨)
 *  - https://www.prizm.co.kr/goods/상품아이디(34진수)y쇼룸아이디(34진수)
 *
 * @example
 *  - 상품 ID 가 147 이고, Showroom ID 가 1 일 경우
 *  ```
 *   const goodsEncrypt = goodsEncrypt(147, 1); // 4by1
 *  ```
 *
 *  - 4by1 을 추출하면
 * ```
 *  const goodsDecrypt = goodsDecrypt(goodsEncrypt); // { goodsId: 147, showroomId: 1 }
 * ```
 */

const URL_SHORTENER_DELIMITER = 'y';
const RADIX = 34;

export const goodsDecrypt = (goodsPageId: string) => {
  const pageIds = goodsPageId.split(URL_SHORTENER_DELIMITER);
  return {
    goodsId: parseInt(pageIds[0], RADIX),
    showRoomId: parseInt(pageIds[1], RADIX) || 0,
  };
};

export const goodsEncrypt = (goodsId: number, showRoomId = 0) => {
  const goodsIdEncrypted = goodsId.toString(RADIX);
  const showRoomIdEncrypted = showRoomId.toString(RADIX);
  return `${goodsIdEncrypted}${URL_SHORTENER_DELIMITER}${showRoomIdEncrypted}`;
};
