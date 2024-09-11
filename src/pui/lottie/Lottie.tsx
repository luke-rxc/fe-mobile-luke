import { forwardRef, HTMLAttributes, MouseEvent, useEffect, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';
import lottie, { AnimationItem, AnimationConfig } from 'lottie-web/build/player/lottie_light';
import cloneDeep from 'lodash/cloneDeep';
import classnames from 'classnames';
import { convertRGBAToHex } from '@utils/color';

export type LottiePlayer = AnimationItem | null;
export type LottieRef = {
  player: LottiePlayer;
};
type ToggleOptions = {
  /** 재생/역재생 여부 */
  active: boolean;
  /** 클릭 비활성 */
  disabled?: boolean;
  /** 클릭 콜백 */
  onClickToggle?: () => void;
};

export type LottieProps = HTMLAttributes<HTMLDivElement> & {
  /** 로띠 json data */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lottieData: any;
  /** 가로 넓이 */
  width?: string;
  /** 세로 높이 */
  height?: string;
  /** 로띠 색상 hex코드 */
  lottieColor?: string;
  /** 로띠 플레이어 옵션 */
  animationOptions?: Omit<AnimationConfig, 'container' | 'renderer'>;
  /** 로띠 토글 여부 */
  toggle?: ToggleOptions;
};

const LottieComponent = forwardRef<LottieRef, LottieProps>(
  ({ className, lottieData, lottieColor = '', animationOptions, toggle, onClick, ...props }, ref) => {
    const classNames = classnames(className);
    const lottiePlayer = useRef<LottiePlayer>(null);
    const animationConfig = {
      ...(animationOptions && { ...animationOptions }),
      ...(toggle && { ...{ loop: false, autoplay: false } }),
    };

    const setLottiePlayer = (el: Element | null) => {
      if (!lottiePlayer.current && el) {
        lottiePlayer.current = lottie.loadAnimation({
          container: el,
          animationData: flatten(lottieData.default, convertRGBAToHex(lottieColor) || lottieColor),
          ...animationConfig,
        });
      }
    };

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (toggle) {
        handleClickToggle();
      }
    };

    // 로띠 애니메이션 토글 클릭
    const handleClickToggle = () => {
      if (!lottiePlayer.current) {
        return;
      }

      if (toggle && !toggle.disabled) {
        lottiePlayer.current.setDirection(toggle.active ? -1 : 1);
        lottiePlayer.current.play();
        toggle?.onClickToggle?.();
      }
    };

    useEffect(() => {
      return () => lottiePlayer.current?.destroy();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      player: lottiePlayer.current,
    }));

    return (
      <div className={classNames} {...props} onClick={toggle ? handleClick : onClick}>
        <div ref={setLottiePlayer} />
      </div>
    );
  },
);

/**
 * 로띠 플레이를 위한 컴포넌트
 * @reference  https://airbnb.io/lottie
 */
export const Lottie = styled(LottieComponent)`
  width: ${({ width = '100%' }) => width};
  height: ${({ height = '100%' }) => height};
`;

/**
 * lottie data 컬러 변경
 * @see {@link https://github.com/xxmuaddib/lottie-colorify}
 * @param color
 * @returns
 */
const convertColorToLottieColor = (color: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  if (!result) {
    return null;
  }
  return [
    Math.round((parseInt(result[1], 16) / 255) * 1000) / 1000,
    Math.round((parseInt(result[2], 16) / 255) * 1000) / 1000,
    Math.round((parseInt(result[3], 16) / 255) * 1000) / 1000,
  ];
};

const flatten = (lottieData: unknown, color: string) => {
  const genTargetLottieColor = convertColorToLottieColor(color);
  if (!genTargetLottieColor) {
    return lottieData;
  }

  const lottieObj = cloneDeep(lottieData);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doFlatten = (targetLottieColor: number[], obj: any) => {
    if (obj.s && Array.isArray(obj.s) && obj.s.length === 4) {
      // eslint-disable-next-line no-param-reassign
      obj.s = [...targetLottieColor, 1];
    } else if (obj.c && obj.c.k) {
      if (Array.isArray(obj.c.k) && typeof obj.c.k[0] !== 'number') {
        doFlatten(targetLottieColor, obj.c.k);
      } else {
        // eslint-disable-next-line no-param-reassign
        obj.c.k = targetLottieColor;
      }
    } else {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object') {
          doFlatten(targetLottieColor, obj[key]);
        }
      });
    }
    return obj;
  };
  return doFlatten(genTargetLottieColor, lottieObj);
};
