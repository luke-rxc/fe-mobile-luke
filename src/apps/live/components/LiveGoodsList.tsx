import { Button } from '@pui/button';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Spinner } from '@pui/spinner';
import { ActionButtonTypeButtonLabel, ActionButtonType, LiveActionType, LogEventTypes } from '../constants';
import { ReturnTypeUseLiveLogService, ReturnTypeUseLiveService } from '../services';
import { LiveActionProps } from '../types';
import { LiveGoodsItem } from './LiveGoodsItem';

type Props = ReturnTypeUseLiveService['goodsList'] & {
  isOpen: boolean;
  isLoading: boolean;
  openValue: string | null;
  couponElement: ReactNode;
  onLogLiveTabGoods: ReturnTypeUseLiveLogService['logLiveTabGoods'];
  onLogLiveImpressionGoodsList: ReturnTypeUseLiveLogService['logLiveImpressionGoodsList'];
  onClickUserAction?: (
    path: LiveActionType,
    actionProps?: LiveActionProps | undefined,
  ) => (event: React.MouseEvent) => void;
};

export const LiveGoodsList = ({
  items = [],
  isOpen,
  isLoading,
  openValue,
  couponElement,
  multiTypeContents,
  onLogLiveTabGoods: handleLogLiveTabGoods,
  onLogLiveImpressionGoodsList: handleLogLiveImpressionGoodsList,
  onClickUserAction: handleClickUserAction,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [touching, setTouching] = useState<boolean>(false);
  const [showActionButton, setShowActionButton] = useState<boolean>(false);
  const [isScrollBottom, setIsScrollBottom] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleLogLiveImpressionGoodsList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { height } = entry.contentRect;
      setShowActionButton((prev) => {
        const flag = height > 10;
        if (flag !== prev) {
          return flag;
        }

        return prev;
      });
    });
  });

  const handleScroll = () => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setIsScrollBottom(true);
      } else {
        setIsScrollBottom(false);
      }
    }
  };

  useEffect(() => {
    const handleTouchStart = () => {
      setTouching(true);
    };

    const handleTouchEnd = () => {
      setTouching(false);
    };

    const remoteEvent = () => {
      if (ref.current) {
        ref.current.removeEventListener('touchstart', handleTouchStart);
        ref.current.removeEventListener('touchend', handleTouchEnd);
        ref.current.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      }
    };

    if (isOpen) {
      if (ref.current) {
        ref.current.addEventListener('touchstart', handleTouchStart);
        ref.current.addEventListener('touchend', handleTouchEnd);
        ref.current.addEventListener('scroll', handleScroll);
        observer.observe(ref.current);
      }
    } else {
      remoteEvent();
    }

    return () => {
      remoteEvent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, ref.current]);

  const prizmOnlyTagOption = openValue
    ? {
        resetTrigger: openValue,
      }
    : undefined;

  if (isLoading) {
    return (
      <LoadingStyled>
        <Spinner />
      </LoadingStyled>
    );
  }

  return (
    <WrapperStyled $touching={touching}>
      <ContentStyled ref={ref}>
        {couponElement}
        {items.map((item) => (
          <LiveGoodsItem
            item={item}
            key={item.goods.id}
            prizmOnlyTagOption={prizmOnlyTagOption}
            onLogLiveTabGoods={handleLogLiveTabGoods}
          />
        ))}
      </ContentStyled>
      {multiTypeContents ? (
        <ActionWraperStyled $open={isOpen && showActionButton}>
          {!isScrollBottom && <GradationWrapperStyled />}
          <Button
            block
            bold
            variant="primary"
            size="large"
            onClick={handleClickUserAction?.(LiveActionType.LIVE_AUCTION, {
              logName: LogEventTypes.LogLiveTabToAppBanner,
            })}
          >
            {ActionButtonTypeButtonLabel[ActionButtonType.AUCTION]}
          </Button>
        </ActionWraperStyled>
      ) : null}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div<{ $touching: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  color: ${({ theme }) => theme.color.black};
  background-color: ${({ theme }) => theme.color.surface};
  ${({ $touching, theme }) =>
    $touching &&
    `
    border-top: 0.05rem solid ${theme.color.gray3};
  `}
`;

const LoadingStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ContentStyled = styled.div`
  flex: 1 1 auto;
  overflow: scroll;

  > div.goods {
    padding: 1.2rem 0;
    font-size: ${({ theme }) => theme.fontSize.s14};
    text-align: left;

    &:last-child {
      margin-bottom: 0;
    }
    > a > span > div {
      width: 100%;
    }
  }
`;

const ActionWraperStyled = styled.div<{ $open: boolean }>`
  position: relative;
  width: 100%;
  padding: 0 2.4rem 2.4rem;
`;

const GradationWrapperStyled = styled.div`
  position: absolute;
  width: 100%;
  height: 3.2rem;
  top: -3.2rem;
  left: 0;

  background: ${({ theme }) =>
    theme.isDarkMode
      ? `linear-gradient(180deg, rgba(32, 32, 32, 0) 0%, #202020 100%)`
      : `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%);`};
`;
