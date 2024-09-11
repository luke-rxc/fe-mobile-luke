import { forwardRef } from 'react';
import styled from 'styled-components';
import { Action, ActionProps } from '@pui/action';
import { Bubble } from '@pui/icon';

export interface CommentProps extends Omit<Extract<ActionProps, { is?: 'button' }>, 'is' | 'link' | 'type'> {
  /** 코멘트 개수 */
  count?: number;
  /** noti&event 영역 타이틀 */
  notiTitle?: string;
  /** noti&event 영역 디스크립션 */
  notiDescription?: string;
  /** 버튼 클릭 콜백 */
  onClickReply?: () => void;
}

/**
 * 코멘트(말풍선) 버튼
 */
export const Comment = styled(
  forwardRef<HTMLButtonElement, CommentProps>(
    ({ count = 0, notiTitle, notiDescription, onClickReply, onClick, ...props }, ref) => {
      /**
       * 클릭 이벤트 핸들러
       */
      const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        onClickReply?.();
        onClick?.(e);
      };

      return (
        <Action ref={ref} aria-label="댓글" onClick={handleClick} {...props}>
          <Bubble />
          {!!count && <span className="badge" />}
        </Action>
      );
    },
  ),
)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 4.8rem;
  height: 4.8rem;

  .badge {
    ${({ theme }) => theme.mixin.absolute({ t: 8, r: 8 })};
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 0.8rem;
    background: ${({ theme }) => theme.color.red};
  }
`;
