import { useWebInterface } from '@hooks/useWebInterface';
import { BrandListItemMedium, BrandListItemMediumProps } from '@pui/brandListItemMedium';
import { forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';

interface FollowingListItemMediumProps extends BrandListItemMediumProps {
  onClickFollow?: ({ id, code, name, follow }: { id: number; code: string; name: string; follow: boolean }) => void;
}

export const FollowingBrandListItemMedium = styled(
  forwardRef<HTMLDivElement, FollowingListItemMediumProps>((props, ref) => {
    const { followed, showroomId, onClickFollow, ...rest } = props;
    const [follow, setFollow] = useState(followed ?? false);
    const { subscribeShowroom } = useWebInterface();

    /**
     * 구독 여부가 변경될 경우, 해당 쇼룸의 상태값 업데이트하여
     * BrandListItemMedium 컴포넌트로 전달
     */
    useEffect(() => {
      if (subscribeShowroom && subscribeShowroom.showroomId === showroomId) {
        setFollow(subscribeShowroom.isSubscribed);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscribeShowroom]);

    return (
      <BrandListItemMedium
        ref={ref}
        {...rest}
        followed={follow}
        showroomId={showroomId}
        onChangeFollow={(isSubscribed, { showroomId: id, showroomCode: code, title: name }) => {
          onClickFollow?.({ id, code, name, follow: isSubscribed });
        }}
      />
    );
  }),
)``;
