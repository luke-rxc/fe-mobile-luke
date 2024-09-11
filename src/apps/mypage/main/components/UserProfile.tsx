import { Action } from '@pui/action';
import { WebLinkTypes } from '@constants/link';
import { UserModel } from '@models/UserModel';
import { Image } from '@pui/image';
import { getImageLink, getWebLink } from '@utils/link';
import styled from 'styled-components';

interface Props {
  userInfo: UserModel;
}

export const UserProfile = ({ userInfo }: Props) => {
  const { nickname, profileImage } = userInfo;
  const imagePath = getImageLink(profileImage.path);
  const profileHref = getWebLink(WebLinkTypes.PROFILE);

  return (
    <>
      <ImageWrapper>
        <Image src={imagePath} lazy />
      </ImageWrapper>
      <Name>{nickname}</Name>
      <ActionWrapper>
        <Action is="a" link={profileHref} title="프로필 편집">
          프로필 편집
        </Action>
      </ActionWrapper>
    </>
  );
};

const ImageWrapper = styled.div`
  width: 9.6rem;
  height: 9.6rem;
  margin: ${({ theme }) => theme.spacing.s16} auto;
  ${Image} {
    border-radius: 50%;
  }
`;

const Name = styled.div`
  font: ${({ theme }) => theme.fontType.largeB};
  text-align: center;
`;

const ActionWrapper = styled.div`
  ${Action} {
    ${({ theme }) => theme.centerItem()};
    height: 4rem;
    margin: ${({ theme }) => `${theme.spacing.s16} ${theme.spacing.s24} 0`};
    border: 1px solid ${({ theme }) => theme.color.gray8};
    border-radius: ${({ theme }) => theme.radius.r6};
    font: ${({ theme }) => theme.fontType.small};
    color: ${({ theme }) => theme.color.black};
  }
`;
