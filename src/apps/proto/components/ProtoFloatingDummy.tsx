import { useState, useLayoutEffect } from 'react';
import format from 'date-fns/format';
import styled from 'styled-components';
import { Button } from '@pui/button';
import { Like } from '@pui/icon';
import { Image } from '@pui/image';

export const CTAFloating = styled(
  ({ className, count = 0, onClick }: { className?: string; count?: number; onClick?: () => void }) => {
    const [innerCount, setInnerCount] = useState<number>(0);

    const handleClick = () => {
      setInnerCount((prev) => prev + 1);
      onClick?.();
    };

    return (
      <div className={className} onClick={handleClick}>
        <Button className="cta-wish" size="large" children={<Like size="3.2rem" />} aria-label="위시리스트에 담기" />
        <Button className="cta-by" size="large" variant="primary" children={`구매${count} ${innerCount}`} bold />
      </div>
    );
  },
)`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.8rem;
  padding: 0.8rem;

  .cta-wish {
    background: rgba(255, 255, 255, 0.9);
    width: 5.6rem;
  }

  ${Like} {
    color: ${({ theme }) => theme.light.color.black};
  }
`;

export const LiveFloating = styled(({ className, onClick }: { className?: string; onClick?: () => void }) => {
  const [time, setTime] = useState<string>(format(new Date().getTime(), 'hh:mm:ss'));

  useLayoutEffect(() => {
    const num = window.setInterval(() => {
      setTime(format(new Date().getTime(), 'hh:mm:ss'));
    }, 1000);

    return () => window.clearInterval(num);
  }, []);

  return (
    <div className={className} onClick={onClick}>
      <Image src="https://none" />
      <div className="live-info">
        <div className="title" children="아이폰 13 Pro 론칭 라이브" />
        <div className="desc" children={time} />
      </div>

      <Button bold is="a" link="/" size="bubble" variant="primary" children="이동" />
    </div>
  );
})`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 64px;
  padding: 1.6rem 1rem;
  border-radius: 0.8rem;
  // backdrop-filter: blur(2.5rem);
  background: rgba(255, 255, 255, 0.5);

  ${Image} {
    display: block;
    width: 4.4rem;
    height: 4.4rem;
    flex: 1 0 auto;
    border-radius: 0.4rem;
  }

  ${Button} {
    flex: 1 0 auto;
    background: ${({ theme }) => theme.color.red};
  }

  .live-info {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    width: 100%;
    flex: 0 1 auto;
    padding: 0 1.2rem;
    color: ${({ theme }) => theme.color.white};

    .title {
      font-weight: 700;
      font-size: 1.5rem;
      line-height: 1.8rem;
    }
    .desc {
      margin-top: 0.2rem;
      font-weight: 400;
      font-size: 1.2rem;
      line-height: 1.4rem;
    }
  }
`;
