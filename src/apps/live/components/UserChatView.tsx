import classNames from 'classnames';
import styled from 'styled-components';
import { ProfileInfo, ProfileProps } from './ProfileInfo';

interface Props extends ProfileProps {
  className?: string;
  chatMessage: string;
  onFocus: () => void;
  onBlur: () => void;
}

/**
 * 사용자 채팅 input component
 */
export const UserChatView = styled(({ className, chatMessage, ...profile }: Props) => {
  return (
    <div className={className}>
      <ProfileInfo className="profile" {...profile} />
      <div className="editor">
        <div className={classNames({ placeholder: chatMessage === '' })} onClick={profile.onFocus}>
          {chatMessage !== '' ? chatMessage : '채팅 입력'}
        </div>
      </div>
    </div>
  );
})`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 0.8rem;
  background-color: ${({ theme }) => theme.light.color.gray50};
  color: ${({ theme }) => theme.light.color.white};
  border-radius: 0.8rem;
  transition: width 0.25s;

  &.show-button {
    width: calc(100% - 8.3rem);
  }

  > div {
    &.profile {
      flex-shrink: 1;
      width: 2.4rem;
      margin-right: ${({ theme }) => theme.spacing.s8};
    }
    &.editor {
      flex: 1 1 auto;
      padding: 1.1rem 2.4rem 1.1rem 0;

      > div {
        height: 1.8rem;

        &.placeholder {
          color: ${({ theme }) => theme.light.color.gray50Dark};
        }
      }
    }
  }
`;
