import styled from 'styled-components';
import { Spinner } from '@pui/spinner';
import classNames from 'classnames';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { LiveFaqItemModel } from '../models';
import { FaqItem } from './FaqItem';

interface Props {
  isApp?: boolean;
  isLoading: boolean;
  items: Array<LiveFaqItemModel> | undefined;
  onClickItem: (faqId: number, title: string, index: number) => void;
}

export const FaqList = ({ isApp = false, isLoading, items, onClickItem: handleClickItem }: Props) => {
  const { isAndroid, isIOS } = useDeviceDetect();

  if (isLoading) {
    return (
      <LoadingStyled className={classNames({ 'full-height': isApp, 'is-aos': isAndroid, 'is-ios': isIOS })}>
        <Spinner />
      </LoadingStyled>
    );
  }

  if (!items || items.length === 0) {
    return (
      <WrapperStyled className={classNames({ 'full-height': isApp, 'is-aos': isAndroid, 'is-ios': isIOS })}>
        등록된 공지가 없습니다
      </WrapperStyled>
    );
  }

  return (
    <ListStyled>
      {items.map((item, index) => {
        return <FaqItem key={item.id} item={item} itemIndex={index} onClickItem={handleClickItem} />;
      })}
    </ListStyled>
  );
};

const ListStyled = styled.div`
  position: relative;
  width: 100%;
  ${({ theme }) => theme.mixin.safeArea('padding-bottom', 32)};
`;

const WrapperStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.color.gray20};

  &.full-height {
    height: calc(var(--vh, 1vh) * 100 - 5.6rem);
    ${({ theme }) => theme.mixin.safeArea('padding-bottom')};

    &.is-ios {
      height: -webkit-fill-available;
    }

    &.is-aos {
      height: calc(var(--vh, 1vh) * 100 / 2);
    }
  }
`;

const LoadingStyled = styled(WrapperStyled)`
  &.full-height {
    height: calc(var(--vh, 1vh) * 100 - 5.6rem);
    ${({ theme }) => theme.mixin.safeArea('padding-bottom')};

    &.is-ios {
      height: -webkit-fill-available;
    }

    &.is-aos {
      height: calc(var(--vh, 1vh) * 100 / 2);
    }
  }
`;
