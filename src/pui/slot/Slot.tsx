import { formatToAmount } from '@utils/string';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export interface SlotProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'prefix'> {
  /** slot motion 숫자 */
  value: number;
  /** 숫자 초기값 */
  initialValue?: number;
  /** 텍스트 앞에 붙는 아이콘을 위한 props */
  prefix?: React.ReactNode;
  /** 텍스트 뒤에 붙는 아이콘을 위한 props */
  suffix?: React.ReactNode;
}

export const Slot = styled(
  forwardRef<HTMLSpanElement, SlotProps>(({ value, initialValue, prefix, suffix, ...props }, ref) => {
    const [count, setCount] = useState<number>(initialValue ?? 0);
    const intervalId = useRef<number | void>(undefined);
    /**
     * slot motion 노션 가이드: https://www.notion.so/rxc/Slot-motion-CTA-button-efab8d42d3a04f679b379e134359ec31
     * fps: 40, duration: 0.5s
     * */
    const fps = 40;
    const fpsInterval = 1000 / fps;
    const duration = 500;
    useEffect(() => {
      if (intervalId.current && count === value) {
        clearInterval(intervalId.current);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);
    useEffect(() => {
      if (value !== count) {
        const changeValue = Math.ceil(Math.abs(value - count) / (duration / fpsInterval));
        intervalId.current = window.setInterval(() => {
          if (count <= value) {
            setCount((prev) => Math.min(prev + changeValue, value));
          } else {
            setCount((prev) => Math.max(prev - changeValue, value));
          }
        }, fpsInterval);
      }
      return () => {
        intervalId.current && clearInterval(intervalId.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
      <span ref={ref} {...props}>
        {prefix && <span>{prefix}</span>}
        {/* 3자리마다 콤마 삽입 */}
        {formatToAmount(count)}
        {suffix && <span>{suffix}</span>}
      </span>
    );
  }),
)``;
