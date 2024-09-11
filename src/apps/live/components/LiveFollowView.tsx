import { Profiles, ProfilesProps, ProfileStatusType } from '@pui/profiles';
import styled from 'styled-components';
import { LiveActionType } from '../constants';
import { ShowroomSimpleModel } from '../models';
import { LiveActionProps } from '../types';
import { BubbleButton } from './BubbleButton';

interface Props {
  showroom: ShowroomSimpleModel | null;
  isLoadingFollow: boolean;
  onClickUserAction: (path: LiveActionType, actionProps?: LiveActionProps) => (event: React.MouseEvent) => void;
}

export const LiveFollowView = ({ showroom, isLoadingFollow, onClickUserAction: handleClickUserAction }: Props) => {
  if (showroom === null) {
    return null;
  }

  const {
    id: showroomId,
    code,
    primaryImage: { path },
    name,
    isFollowed,
    textColor,
    tintColor,
  } = showroom;
  const profileProps: ProfilesProps = {
    showroomCode: code,
    liveId: null,
    image: {
      src: path,
    },
    size: 144,
    status: ProfileStatusType.NONE,
  };

  const fontStyledProps = {
    $textColor: isFollowed ? null : textColor,
    $tintColor: isFollowed ? null : tintColor,
  };

  return (
    <WrapperStyled {...fontStyledProps}>
      <Profiles
        {...profileProps}
        disabledLink
        onClick={handleClickUserAction(LiveActionType.TAB_SHOWROOM_FOLLOW, { showroomId })}
      />
      <ShowroomNameStyled>{name}</ShowroomNameStyled>
      <BubbleButton
        variant={isFollowed ? 'tertiaryfill' : 'primary'}
        bold
        loading={isLoadingFollow}
        onClick={handleClickUserAction(LiveActionType.SHOWROOM_FOLLOW, { showroomId })}
      >
        {isFollowed ? '팔로잉' : '팔로우'}
      </BubbleButton>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div<{
  $textColor: string | null;
  $tintColor: string | null;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${Profiles} {
    margin-top: 1.3rem;
  }

  ${BubbleButton} {
    margin-top: 4.4rem;
    margin-bottom: 6.2rem;
    ${({ $textColor }) =>
      $textColor &&
      `
      color: ${$textColor};
    `}
    ${({ $tintColor }) =>
      $tintColor &&
      `
      background: ${$tintColor};
    `}
  }
`;

const ShowroomNameStyled = styled.div`
  color: ${({ theme }) => theme.color.black};
  font-size: ${({ theme }) => theme.fontSize.s20};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;
