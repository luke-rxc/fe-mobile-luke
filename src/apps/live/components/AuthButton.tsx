import { forwardRef, useRef } from 'react';
import styled from 'styled-components';
import { AppLinkTypes } from '@constants/link';
import { Button, ButtonProps } from '@pui/button';
import { Checkmark as CheckMarkIcon } from '@pui/icon';
import { CheckMark as CheckMarkLottie } from '@pui/lottie';
import { toAppLink } from '@utils/link';

type AuthButtonProps = ButtonProps & {
  // 인증 완료 여부
  done: boolean;
  // 버튼 텍스트
  text: string;
  // AppLink 타입
  linkType: AppLinkTypes;
  // Click 핸들러
  onClick?: () => void;
};

export const AuthButtonComponent = forwardRef<HTMLAnchorElement | HTMLButtonElement, AuthButtonProps>(
  ({ done, text, linkType, onClick, ...props }, ref) => {
    // done 초기값
    const initial = useRef(done);

    const handleClick = () => {
      onClick?.();
      toAppLink(linkType);
    };

    return (
      <Button
        ref={ref}
        bold
        block
        disabled={done}
        variant="tertiaryfill"
        size="large"
        suffix={
          done &&
          (initial.current ? (
            <CheckMarkIcon size="1.8rem" color="gray20" />
          ) : (
            <div className="lottie">
              <CheckMarkLottie width="1.8rem" height="1.8rem" animationOptions={{ loop: false }} />
            </div>
          ))
        }
        onClick={handleClick}
        children={text}
        {...props}
      />
    );
  },
);

export const AuthButton = styled(AuthButtonComponent)`
  /* Lottie 컴포넌트 opacity 조정 불가로 별도 처리  */
  .lottie {
    & *[fill] {
      fill: ${({ theme }) => theme.color.gray20};
    }
    & *[stroke] {
      stroke: ${({ theme }) => theme.color.gray20};
    }
  }
`;
