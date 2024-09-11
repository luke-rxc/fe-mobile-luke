import { useEffect } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import { TitleSection } from '@pui/titleSection';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { useLoading } from '@hooks/useLoading';
import { List } from '@pui/list';
import { GoodsCardSmall } from '@pui/goodsCardSmall';
import { SearchBar, SearchHistory, SearchPageError, SearchSectionItem } from '../components';
import { useSearchAutoCompleteService, useSearchMainService } from '../services';
import { SearchRecommendation } from '../components/SearchRecommendation';

interface Props {
  className?: string;
}

export const SearchMainContainer = styled(({ className }: Props) => {
  const { isApp } = useDeviceDetect();
  const { showLoading, hideLoading } = useLoading();

  // 검색 자동완성
  const { searchAutoComplete, handleClickBack, handleChangeSearchKeyword, handleSubmitSearchKeyword } =
    useSearchAutoCompleteService();

  // 검색 메인
  const {
    mainError,
    isMainError,
    isMainLoading,
    isMainEmpty,

    // 최근 검색어
    searchHistory,
    handleClearSearchHistory,
    handleDeleteSearchHistory,
    handleClickSearchHistory,

    // 추천 검색어
    searchRecommendation,
    handleVisibilitySearchRecommendation,
    handleClickSearchRecommendation,

    // 상품 섹션 > 실시간 인기
    goodsPopular,

    // 상품 섹션 > 최근 본 상품
    goodsHistory,
  } = useSearchMainService();

  // Loading
  useEffect(() => {
    if (isMainLoading) {
      showLoading();
    } else {
      hideLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMainLoading]);

  /* eslint-disable no-nested-ternary */
  return (
    <div className={className}>
      {/* 모웹 검색바 */}
      {!isApp && (
        <SearchBar
          autoFocus
          onClickBack={handleClickBack}
          onChangeKeyword={handleChangeSearchKeyword}
          autoComplete={searchAutoComplete}
          onSubmit={handleSubmitSearchKeyword}
        />
      )}

      {isMainError ? (
        // Error
        <SearchPageError error={mainError} />
      ) : isMainLoading ? (
        // Loading
        <></>
      ) : isMainEmpty ? (
        // Empty
        <SearchPageError description="원하는 상품 또는 브랜드를 검색해보세요" />
      ) : (
        // Contents
        <>
          {/* 최근 검색어 */}
          {!isEmpty(searchHistory) && (
            <SearchHistory
              history={searchHistory}
              onClick={handleClickSearchHistory}
              onDelete={handleDeleteSearchHistory}
              onDeleteAll={handleClearSearchHistory}
            />
          )}

          {/* 추천 검색어 */}
          {!isEmpty(searchRecommendation) && (
            <SearchRecommendation
              list={searchRecommendation}
              onVisibility={handleVisibilitySearchRecommendation}
              onClick={handleClickSearchRecommendation}
            />
          )}

          {/* 상품 섹션 > 실시간 인기 */}
          {goodsPopular && <SearchSectionItem title="실시간 인기" {...goodsPopular} />}

          {/* 상품 섹션 > 최근 본 상품 */}
          {goodsHistory && <SearchSectionItem title="최근 본 상품" {...goodsHistory} />}
        </>
      )}
    </div>
  );
})`
  padding-bottom: ${({ theme }) => theme.spacing.s24};

  ${TitleSection} {
    &:not(:first-child) {
      margin-top: 1.2rem;
    }

    .title {
      font: ${({ theme }) => theme.fontType.mediumB};
    }
  }

  ${List} {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    overflow-x: auto;
    box-sizing: border-box;
    width: 100%;
    padding: 0 2.4rem;

    &::-webkit-scrollbar {
      display: none;
    }

    ${GoodsCardSmall} {
      flex: 0 0 auto;
      margin-left: 1.6rem;

      &:first-child {
        margin-left: 0;
      }
    }
  }
`;
