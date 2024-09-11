import { Checkbox } from '@pui/checkbox';
import { Image } from '@pui/image';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '@hooks/useTheme';
import { ShowroomItemInfoModel, ShowroomItemModel } from '../models';

export interface ShowroomItemProps {
  showroom: ShowroomItemModel;
  checkedShowroomList: ShowroomItemInfoModel[];
  index: number;
  tappedToolbarButton?: boolean;
  onClick: (e: React.ChangeEvent<HTMLInputElement>, id: number, index: number) => void;
}

export const ShowroomItem = ({
  showroom,
  checkedShowroomList,
  index,
  tappedToolbarButton,
  onClick: handleClick,
}: ShowroomItemProps) => {
  const { mode } = useTheme();
  const container = useRef<HTMLLIElement>(null);
  const { id, code, name, categoryName, primaryMedia } = showroom;

  const [isPressed, setIsPressed] = useState<boolean>(false);

  const handlePressed = () => {
    setIsPressed(true);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
  };

  useEffect(() => {
    if (tappedToolbarButton && container.current && !container.current.classList.contains('in-view')) {
      container.current.classList.add('in-view');
    }
  }, [tappedToolbarButton]);

  /**
   * 팔로우할 쇼룸 선택 여부
   */
  const isChecked = checkedShowroomList.map((showroomList) => showroomList.id).includes(showroom.id);

  /**
   * Intersection observer 핸들러
   */
  const handleVisibility = ([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting) {
      if (container.current && !container.current.classList.contains('in-view')) {
        container.current.classList.add('in-view');
      }
    }
  };

  /**
   * 페이지 내, 쇼룸 아이템 노출 여부 체크
   */
  useEffect(() => {
    let observer: IntersectionObserver;

    if (container.current) {
      observer = new IntersectionObserver(handleVisibility, { threshold: 0.4 });
      observer.observe(container.current);
    }

    return () => observer && observer.disconnect();
  }, [mode]);

  return (
    <Item ref={container}>
      <Wrapper
        className={isPressed ? 'is-pressed' : ''}
        onTouchStart={handlePressed}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
      >
        <Checkbox
          value={code}
          title={name}
          checked={isChecked}
          className={isChecked ? 'is-checked' : ''}
          onChange={(e) => handleClick(e, id, index)}
          children={
            <div className="item">
              <div className="inner">
                <div className="thumbnail">
                  <Image src={primaryMedia.src} alt={name} />
                </div>
              </div>
              <em className="name">{name}</em>
              <div className="category">{categoryName}</div>
            </div>
          }
        />
      </Wrapper>
    </Item>
  );
};

const Item = styled.li`
  position: relative;

  &.in-view {
    ${Image} {
      top: -100%;
    }
  }

  .inner {
    width: calc(100% + 1px);
    aspect-ratio: 1;
  }

  .thumbnail {
    overflow: hidden;
    z-index: 1;
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    isolation: isolate;
    clip-path: circle(calc(50% - 1px));
  }

  ${Checkbox} {
    z-index: 1;
    overflow: visible;
    width: 100%;

    .checkbox-handler {
      display: none;
    }

    .checkbox-label {
      width: 100%;
      transition: transform 0.2s 0.05s;
      border-radius: ${({ theme }) => theme.radius.r8};
      background: ${({ theme }) => theme.color.background.surfaceHigh};
      will-change: transform;
    }

    &.is-checked {
      .checkbox-label {
        transform: scale(0.92);
      }

      .item {
        background: ${({ theme }) => theme.color.states.selectedBg};
        box-shadow: none;
      }

      ${Image} {
        transform: translateY(50%);
        transition: transform 0.3s;
      }
    }
  }

  ${Image} {
    ${({ theme }) => theme.absolute({ t: 0, r: 0, l: 0 })};
    height: auto;
    vertical-align: top;
    transform: translateY(0%);
    transition: top 0.4s 1s, transform 0.3s;
    will-change: transform;
  }

  .item {
    overflow: hidden;
    ${({ theme }) => theme.centerItem()};
    flex-direction: column;
    padding: 2.4rem 2.4rem 2.6rem;
    border-radius: ${({ theme }) => theme.radius.r8};
    text-align: center;
    box-shadow: 0 0.4rem 2rem 0 rgba(0, 0, 0, 0.08);
    isolation: isolate;
    transition: background 0.2s 0.05s, box-shadow 0.2s;
  }

  .name {
    width: 100%;
    margin-top: ${({ theme }) => theme.spacing.s24};
    font: ${({ theme }) => theme.fontType.mediumB};
    color: ${({ theme }) => theme.color.black};
    ${({ theme }) => theme.ellipsis};
  }

  .category {
    width: 100%;
    margin-top: ${({ theme }) => theme.spacing.s4};
    font: ${({ theme }) => theme.fontType.mini};
    color: ${({ theme }) => theme.color.gray50};
    ${({ theme }) => theme.ellipsis};
  }
`;

const Wrapper = styled.div`
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &.is-pressed {
    .checkbox-label {
      transform: scale(0.88) !important;
    }

    .item {
      background: ${({ theme }) => theme.color.states.selectedBg};
      box-shadow: none;
    }
  }
`;
