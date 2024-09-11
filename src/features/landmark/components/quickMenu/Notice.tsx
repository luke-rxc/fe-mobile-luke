import { forwardRef } from 'react';
import styled from 'styled-components';
import { WebLinkTypes } from '@constants/link';
import { useLink } from '@hooks/useLink';
import { Action, ActionProps } from '@pui/action';
import { Bell } from '@pui/icon';
import { useLogService } from '@features/landmark/services/useLogService';
import { useNavigationState } from '../../hooks/useNavigation';

export type NoticeProps = Omit<Extract<ActionProps, { is?: 'a' }>, 'is' | 'link' | 'type'>;

/**
 * 알림(Bell) 아이콘
 * @TODO 링크 연결
 */
export const Notice = styled(
  forwardRef<HTMLAnchorElement, NoticeProps>(({ ...props }, ref) => {
    const { getLink } = useLink();
    const { logClickBell } = useLogService();
    const { notiCount } = useNavigationState();

    const handleClick = () => {
      logClickBell();
    };

    return (
      <Action
        ref={ref}
        is="a"
        link={getLink(WebLinkTypes.NOTIFICATIONS)}
        aria-label="알림"
        {...props}
        onClick={handleClick}
      >
        <Bell />
        {!!notiCount && <span className="badge" />}
      </Action>
    );
  }),
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
