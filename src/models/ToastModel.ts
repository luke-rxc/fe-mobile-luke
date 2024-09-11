/** Type */
/** direction type */
export type ToastDirectionType = 'top' | 'center' | 'bottom';
/** variants type */
export type ToastVariantsType = 'base' | 'failure' | 'success';

/**
 * 우측 버튼
 */
export interface ToastActionProps {
  label: string;
  // 링크 주소
  href?: string;
  // onClick Event
  onClick?: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, toastId: string) => void;
}

/**
 * Toast Component 내 Props
 */
export interface ToastInnerProps {
  // 우측 버튼 Props
  action?: ToastActionProps;
  // 좌측 Element : Image
  image?: string;
  // class name
  className?: string;
  // title
  title?: string;
  // message
  message?: string;
}

/**
 * Toast Container 내 Props
 */
export interface ToastProps extends ToastInnerProps {
  // class name
  className?: string;
  // toast 배경 타입
  /** @description failure, success는 v1에서 사용하지 않음, 21.12.22 */
  variants?: ToastVariantsType;
  // toast 위치
  direction?: ToastDirectionType;
  // 자동 Remove (ms 기준)
  autoDismiss?: number | false;
  // fade time (ms 기준), Slide를 사용할때 같은 값으로 반영
  fadeTime?: number;
  // slide Option 사용 여부 (현재 Direction Bottom 모드만 사용 가능)
  slide?: boolean;
  // 기존 위치에서의 조정값
  top?: string;
}
