import styled from 'styled-components';
import { Image } from '@pui/image';

interface Props {
  imageUrl?: string;
  title: string;
  method: string;
  className?: string;
}

export const LoginUserProfile = ({ imageUrl, title, method, className }: Props) => {
  return (
    <ContainerStyled className={className}>
      {imageUrl ? (
        <div className="img-box">
          <Image src={imageUrl} className="profile-img" />
        </div>
      ) : (
        <div className="img-box">
          <span className="profile-img non-image" />
        </div>
      )}
      <div className="title">{title}</div>
      <p className="description">{getDescriptionText(method)}</p>
    </ContainerStyled>
  );
};

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  & .img-box {
    display: inline-flex;
    width: 14.4rem;
    height: 14.4rem;
    padding: 1.6rem;

    .profile-img {
      border-radius: 5.6rem;

      &.non-image {
        width: 100%;
        background: ${({ theme }) => theme.color.bg};
      }
    }
  }

  & .title {
    color: ${({ theme }) => theme.color.black};
    font: ${({ theme }) => theme.fontType.t24B};
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    text-align: center;
  }

  & .description {
    white-space: pre-line;
    font: ${({ theme }) => theme.fontType.t15};
    color: ${({ theme }) => theme.color.black};
  }
`;

function getDescriptionText(method: string): string {
  if (method === 'email') {
    return `이메일에서 인증번호를 확인해주세요`;
  }

  if (method === 'kakao') {
    return '확인을 눌러 가입을 완료해주세요';
  }

  return '동의 후 가입을 완료해주세요';
}
