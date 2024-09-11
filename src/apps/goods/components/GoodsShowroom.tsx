import React from 'react';
import { FetchNextPageOptions, InfiniteQueryObserverResult } from 'react-query';
import styled from 'styled-components';
import { Theme } from '@styles/theme';
import { Profiles, ProfileStatusType } from '@pui/profiles';
import { GoodsList } from '@pui/goodsList';
import { GoodsCardProps } from '@pui/goodsCard';
import { ErrorModel, ErrorDataModel } from '@utils/api/createAxios';
import nl2br from '@utils/nl2br';
import { ShowroomModel, DealsModel } from '../models';

interface Props {
  /**
   * ProfileCard 정보
   */
  showRoom: ShowroomModel | undefined;
  theme: Theme;

  /**
   * List 정보
   */
  deals: DealsModel;
  hasMoreDeals?: boolean;
  isDealsFetching: boolean;
  onLoadDeals: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<GoodsCardProps, ErrorModel<ErrorDataModel>>>;
  onProfileIconClick: () => void;
  onDealsListClick: (goods: GoodsCardProps, index: number) => void;
}

export const GoodsShowroom: React.FC<Props> = ({
  showRoom,
  deals,
  hasMoreDeals = false,
  isDealsFetching,
  onLoadDeals: handleLoadDeals,
  onProfileIconClick: handleProfileIconClick,
  onDealsListClick: handleDealsListClick,
}) => {
  if (typeof showRoom === 'undefined') {
    return null;
  }

  const { code: showroomCode, name: showroomName, primaryImage, liveId, onAir } = showRoom;

  return (
    <>
      <BrandInfoWrapper>
        <Profiles
          size={144}
          image={{
            src: primaryImage?.path ?? '',
          }}
          liveId={liveId}
          showroomCode={showroomCode}
          status={onAir ? ProfileStatusType.LIVE : ProfileStatusType.NONE}
          onClick={handleProfileIconClick}
        />
        <div className="title-bx">
          <p className="title">{nl2br(showroomName ?? '')}</p>
        </div>
      </BrandInfoWrapper>
      {deals && (
        <GoodsListStyled
          goodsList={deals}
          infiniteOptions={{ rootMargin: '50px' }}
          disabled={!hasMoreDeals}
          loading={isDealsFetching}
          onScrolled={handleLoadDeals}
          onListClick={handleDealsListClick}
        />
      )}
    </>
  );
};

const BrandInfoWrapper = styled.div`
  padding: 2.4rem 0;

  ${Profiles} {
    position: relative;
    margin: 0 auto;

    /** Showroom Profile Override, #PQ-723 */
    a {
      &:before {
        transition: opacity 0.2s;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        content: '';
      }
      &:active {
        transform: scale(1);
      }
    }
  }

  .title-bx {
    position: relative;
    text-align: center;
  }
  .title {
    font: ${({ theme }) => theme.fontType.titleB};
    color: ${({ theme, color }) => color || theme.color.black};
    word-break: break-all;
  }
`;

const GoodsListStyled = styled(GoodsList)`
  .goods-list {
    padding: 0;
  }
`;
