import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import classnames from 'classnames';
import { Image } from '@pui/image';
import { Action } from '@pui/action';
import { ReviewShortcutDelay } from '../constants';
import { ReviewShortcutModel } from '../models/ReviewModel';

interface GoodsReviewShortcutProps {
  goodsId: number;
  reviewShortcutList: ReviewShortcutModel[];
  sectionLink: string;
  onClick?: () => void;
}

const GoodsReviewShortcutComponent = ({
  goodsId,
  reviewShortcutList,
  sectionLink,
  onClick: handleClick,
  ...props
}: GoodsReviewShortcutProps) => {
  const shortcutList = useRef<HTMLOListElement>(null);
  const [loaded, setLoaded] = useState<number>(0);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  /**
   * 숏컷 애니메이션 실행을 위한, 썸네일 이미지 로드 완료 여부 체크
   */
  const handleLoadCompleted = () => {
    setLoaded((prev) => prev + 1);

    if (loaded === reviewShortcutList.length - 1) {
      shortcutList.current?.classList.add('active');
    }
  };

  /**
   * App에서 페이지 전환 후 상품상세 페이지로 돌아올 경우에도 애니메이션 실행
   */
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      shortcutList.current?.classList.remove('active');
      return;
    }
    /**
     * AOS(플립, 폴드)에서 애니메이션 적용안되는 이슈로 인해 setTimeout 추가
     */
    setTimeout(() => {
      shortcutList.current?.classList.add('active');
    }, 100);
  };

  const handlePressed = () => {
    setIsPressed(true);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange, false);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange, false);
    };
  }, []);

  return (
    <Action is="a" link={sectionLink} onClick={handleClick} {...props}>
      <List
        className="shortcut-list"
        ref={shortcutList}
        onTouchStart={handlePressed}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressEnd}
      >
        {reviewShortcutList.map((shortcut, index) => {
          const { id, path, blurHash } = shortcut;
          return (
            <Item
              key={id}
              className={classnames('shortcut-item', { 'is-pressed': isPressed })}
              index={index}
              length={reviewShortcutList.length}
            >
              <Image src={path} blurHash={blurHash} onLoad={handleLoadCompleted} alt="profile image" />
            </Item>
          );
        })}
      </List>
    </Action>
  );
};

export const GoodsReviewShortcut = styled(GoodsReviewShortcutComponent)`
  ${({ theme }) => theme.centerItem()};
  height: 4.8rem;
  padding: 0 1rem 0 1.8rem;
  margin-right: -1rem;
  margin-left: auto;
  -webkit-tap-highlight-color: transparent;

  .shortcut-list {
    display: flex;
    flex-direction: row-reverse;

    .shortcut-item {
      position: relative;
      overflow: hidden;
      width: 2rem;
      height: 2rem;
      margin-left: -0.8rem;
      border-radius: 50%;

      /** press 효과 */
      &:before {
        z-index: 1;
        border-radius: 50%;
      }
      &.is-pressed {
        transform: scale(0.96);
        transition: transform 0.2s;
        &:before {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${({ theme }) => theme.color.black};
          opacity: 0.1;
          content: '';
        }
      }

      ${Image} {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  28.5% {
    transform: scale(1.2);
  }
  57% {
    transform: scale(0.88);
  }
  71.4% {
    transform: scale(1.08);
  }
  85.7% {
    transform: scale(0.96);
  }
`;

const Item = styled.li<{ index: number; length: number }>`
  animation-duration: 0.7s;

  &:nth-of-type(${({ index }) => index + 1}) {
    z-index: ${({ length, index }) => length - index};
    animation-delay: ${({ index }) => `${ReviewShortcutDelay + index * 0.2}s`};
  }
`;

const List = styled.ol`
  &.active {
    ${Item} {
      animation-name: ${bounce};
    }
  }
`;
