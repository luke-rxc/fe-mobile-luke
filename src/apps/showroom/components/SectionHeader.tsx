import styled from 'styled-components';
import { SwiperContainer, SwiperSlide } from '@pui/swiper';
import { Image } from '@pui/image';
import { Action } from '@pui/action';
import { useState } from 'react';
// eslint-disable-next-line import/no-cycle
import { SectionItemProps } from './SectionItem';

export interface SectionHeaderProps {
  section: SectionItemProps;
  onClickSectionHeader?: (item: SectionItemProps, id: number, index: number, title: string) => void;
}

export const SectionHeader = ({ section, onClickSectionHeader }: SectionHeaderProps) => {
  const handleClickSectionHeader = (item: SectionItemProps, id: number, index: number, title: string) => () => {
    onClickSectionHeader?.(item, id, index, title);
  };
  // 섹션 헤더가 2개 이상인 경우에만 Swiper loop 작동되기 위함
  const isMultipleHeader = section.headerList.length > 1;

  const [isPressed, setIsPressed] = useState<boolean>(false);

  const handlePressed = () => {
    setIsPressed(true);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
  };

  return (
    <Container>
      <SwiperContainer pagination loop={isMultipleHeader} className={isPressed ? 'is-pressed' : ''}>
        {section.headerList.map((item, index) => {
          const { id, title, image, landingLink } = item;
          const isExistTitle = !!title;

          return (
            <SwiperSlide
              key={id}
              onTouchStart={handlePressed}
              onTouchEnd={handlePressEnd}
              onTouchCancel={handlePressEnd}
            >
              <Action
                is="a"
                link={landingLink}
                onClick={handleClickSectionHeader(section, id, index, title)}
                className={isExistTitle ? 'is-mask' : ''}
              >
                <Title>{title}</Title>
                <Image src={image.src} blurHash={image.blurHash} />
              </Action>
            </SwiperSlide>
          );
        })}
      </SwiperContainer>
    </Container>
  );
};

const Container = styled.div`
  margin: ${({ theme }) => `0 ${theme.spacing.s24} ${theme.spacing.s16}`};
  height: 12.8rem;

  ${SwiperContainer} {
    overflow: hidden;
    border-radius: ${({ theme }) => theme.radius.r8};
    transition: transform 0.2s;

    .swiper {
      overflow: hidden;
      border-radius: ${({ theme }) => theme.radius.r8};
    }

    &.is-pressed {
      transform: scale(0.96);

      &::before {
        z-index: 2;
        ${({ theme }) => theme.absolute({ t: 0, r: 0, b: 0, l: 0 })};
        background: ${({ theme }) => theme.color.states.pressedMedia};
        pointer-events: none;
        content: '';
      }
    }
  }

  ${Action} {
    display: block;

    &.is-mask {
      &::after {
        ${({ theme }) => theme.absolute({ r: 0, b: 0, l: 0 })};
        height: 9.6rem;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
        content: '';
      }
    }
  }

  ${Image} {
    height: 12.8rem;
  }

  .swiper-pagination {
    padding-bottom: 0.8rem !important;
  }

  .swiper-pagination-bullet,
  .swiper-pagination-bullet-active {
    background: ${({ theme }) => theme.color.whiteLight} !important;
    opacity: 0.16;
  }
`;

const Title = styled.strong`
  z-index: 1;
  position: absolute;
  right: 2.4rem;
  bottom: 2.4rem;
  left: 2.4rem;
  font: ${({ theme }) => theme.fontType.mediumB};
  color: ${({ theme }) => theme.color.whiteLight};
  ${({ theme }) => theme.mixin.multilineEllipsis(2, 18)};
  white-space: pre-line;
  text-align: center;
`;
