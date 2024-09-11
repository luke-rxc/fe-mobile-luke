/* eslint-disable react-hooks/exhaustive-deps */
import { forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWebInterface } from '@hooks/useWebInterface';
import { BrandCard as Component, BrandCardProps as Props } from '@pui/brandCard';

interface FollowParams {
  id: number;
  code: string;
  name: string;
  follow: boolean;
}

export interface BrandCardProps extends Omit<Props, 'onChangeFollow'> {
  // Follow 클릭 콜백
  onClickFollow?: (params: FollowParams) => void;
  // Follow 변경 콜백
  onChangeFollow?: (params: Omit<FollowParams, 'name'>) => void;
}

/**
 * useWebInterface의 subscribeShowroom가 연동된 BrandCard 컴포넌트
 */
export const BrandCard = styled(
  forwardRef<HTMLSpanElement, BrandCardProps>(
    ({ showroomId, showroomCode, followed, onClickFollow, onChangeFollow, ...rest }, ref) => {
      const { subscribeShowroom } = useWebInterface();
      const [follow, setFollow] = useState(followed ?? false);

      /**
       * 팔로우/언팔로우 버튼을 클릭시 실행할 콜백 함수
       */
      const handleClickFollow: Props['onChangeFollow'] = (
        isSubscribed,
        { showroomId: id, showroomCode: code, title: name },
      ) => {
        onClickFollow?.({ id, code, name, follow: isSubscribed });
      };

      /**
       * props의 followed값이 변경될 때 내부 state 업데이트
       */
      useEffect(() => {
        setFollow((prev) => followed ?? prev);
      }, [followed]);

      /**
       * follow 상태에 대한 Sync
       *
       * webInterface의 subscribeShowroom state값이 업데이트될 때
       * 업데이트 된 쇼룸의 정보가 해당 컴포넌트가 가지고 있는 쇼룸 정보와 동일할때
       * 컴포넌트 내부의 follow 상태를 업데이트
       */
      useEffect(() => {
        if (
          subscribeShowroom &&
          subscribeShowroom.showroomId === showroomId &&
          subscribeShowroom.showroomCode === showroomCode
        ) {
          setFollow(subscribeShowroom.isSubscribed);

          // onlyState 옵션이 true인 경우 state 변경만 처리하고, 이후 onChangeFollow는 skip
          subscribeShowroom.options?.onlyState ||
            onChangeFollow?.({
              id: subscribeShowroom.showroomId,
              code: subscribeShowroom.showroomCode,
              follow: subscribeShowroom.isSubscribed,
            });
        }
      }, [subscribeShowroom]);

      return (
        <Component
          ref={ref}
          {...rest}
          followed={follow}
          showroomId={showroomId}
          showroomCode={showroomCode}
          onChangeFollow={handleClickFollow}
        />
      );
    },
  ),
)``;
