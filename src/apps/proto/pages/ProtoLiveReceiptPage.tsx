import { Button } from '@pui/button';
import { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { LiveReceipt01 } from '@pui/lottie';
import debounce from 'lodash/debounce';
import { ReceiptLottie } from '../../live/components';

const ProtoLiveReceiptPage = () => {
  const [receiptList, setReceiptList] = useState<ReturnType<typeof LiveReceipt01>[]>([]);
  const [prevIdx, setPrevIdx] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const randomNum = useRef<number>(0);

  const addReceiptItem = useMemo(
    () =>
      debounce(() => {
        randomNum.current = Math.floor(Math.random() * 5);

        // 이전에 실행된 Lottie 파일과 겹치지 않도록 함
        if (randomNum.current === prevIdx) {
          if (prevIdx < 4) {
            randomNum.current += 1;
          } else {
            randomNum.current -= 1;
          }
        }
        setPrevIdx(randomNum.current);

        // Lottie 컴포넌트 랜덤 추가
        setReceiptList(receiptList.concat(<ReceiptLottie randomIdx={randomNum.current} onComplete={handleComplete} />));
      }, 150),
    [prevIdx, receiptList],
  );

  const handleClick = () => {
    addReceiptItem();
  };

  /**
   * 애니메이션 완료 시, DOM 트리에서 순차 제거
   */
  const handleComplete = () => {
    containerRef.current?.removeChild(containerRef.current.children[0]);
  };

  return (
    <>
      <Button variant="primary" onClick={handleClick}>
        ADD RECEIPT
      </Button>
      <ReceiptWrapper ref={containerRef}>{receiptList}</ReceiptWrapper>
    </>
  );
};

export default ProtoLiveReceiptPage;

const ReceiptWrapper = styled.div`
  position: absolute;
  right: 2rem;
  bottom: 3rem;
  width: 9.6rem;
  height: 25.6rem;
  background: rgba(255, 255, 255, 0.1);
  color: yellow;
`;
