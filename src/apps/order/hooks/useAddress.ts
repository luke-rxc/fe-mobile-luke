import { useCallback, useRef, useState } from 'react';
import { useScript } from '@hooks/useScript';
import { DaumAddressModel } from '../models';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    daum: any;
  }
}

export const useAddress = <T extends HTMLElement>() => {
  const [address, setAddress] = useState<{
    code: string;
    addr: string;
  }>();
  const ref = useRef<T>(null);
  const { status } = useScript('//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');

  const toAddr = useCallback((data: DaumAddressModel) => {
    // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
    // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
    // 사용자가 도로명 주소를 선택했을 경우
    // 사용자가 지번 주소를 선택했을 경우(J)
    return data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
  }, []);

  /**
   * @reference https://postcode.map.daum.net/guide#sample
   */
  const toAddressInfo = useCallback(
    (data: DaumAddressModel) => {
      // 각 주소의 노출 규칙에 따라 주소를 조합한다.
      const addr = toAddr(data);
      return { code: data.zonecode, addr };
    },
    [toAddr],
  );

  const show = useCallback(() => {
    if (!status) {
      return;
    }

    new window.daum.Postcode({
      // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
      oncomplete: (data: DaumAddressModel) => {
        const addr = toAddressInfo(data);
        setAddress(addr);
      },
      width: '100%',
      height: '100%',
    }).embed(ref.current);
  }, [status, toAddressInfo]);

  return {
    address,
    ref,
    show,
  };
};
