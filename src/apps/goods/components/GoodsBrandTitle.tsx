import React from 'react';
import styled, { keyframes } from 'styled-components';
import classnames from 'classnames';
import { useLink } from '@hooks/useLink';
import { SVG } from '@pui/svg';
import { ChevronRight } from '@pui/icon';
import { UniversalLinkTypes } from '@constants/link';
import { AnchorInnerComponent } from './AnchorInnerComponent';
import { GoodsModel } from '../models';

interface Props {
  brand: GoodsModel['brand'];
  onClick?: () => void;
}

export const GoodsBrandTitle: React.FC<Props> = React.memo(({ brand, onClick }) => {
  const { getLink } = useLink();
  const { name, primaryImage, showRoom } = brand ?? {};
  const { code: showroomCode } = showRoom ?? {};
  const showRoomLink = showroomCode
    ? getLink(UniversalLinkTypes.SHOWROOM, {
        showroomCode,
      })
    : null;
  const handleClick = () => {
    onClick?.();
  };

  return (
    <Wrapper>
      <AnchorInnerComponent
        link={showRoomLink}
        onClick={handleClick}
        className={classnames('title', {
          'wrapper-image': primaryImage,
          'wrapper-text': !primaryImage,
        })}
        size="regular"
      >
        {primaryImage ? (
          <SVG src={`${primaryImage.path}`} className="title-image" />
        ) : (
          <p className="title-text">{name}</p>
        )}
        {showRoomLink && <ChevronRight />}
      </AnchorInnerComponent>
    </Wrapper>
  );
});

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Wrapper = styled.div`
  display: flex;
  height: 4.8rem;

  & .wrapper-image {
    padding: 1.2rem 0;
  }

  & .wrapper-text {
    padding: 1.5rem 0;
  }

  & .title {
    display: flex;
    align-items: center;

    & .title-image {
      max-width: 11.6rem;
      width: auto;
      height: 2.4rem;
      animation: 50ms linear ${fadeIn};
    }

    & .title-text {
      color: ${({ theme }) => theme.color.text.textTertiary};
      font: ${({ theme }) => theme.fontType.mediumB};
    }
  }

  ${ChevronRight} {
    color: ${({ theme }) => theme.color.gray50};
  }
`;
