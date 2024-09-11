import styled from 'styled-components';
import { PageError } from '@features/exception/components';
import { useHeaderDispatch } from '@features/landmark/hooks/useHeader';
import { GoodsList } from '@pui/goodsList';
import { TitleSection } from '@pui/titleSection';
import { rn2br } from '@utils/string';
import { useWishListService } from '../services';

export const WishListContainer = () => {
  const {
    wishListData,
    wishListError,
    isWishListLoading,
    isWishListError,
    isWishListFetching,
    hasMoreWishList,
    handleLoadWishList,
    handleChangeWish,
  } = useWishListService();

  useHeaderDispatch({
    type: 'mweb',
    title: '위시리스트',
    enabled: !isWishListLoading,
    quickMenus: ['cart', 'menu'],
  });

  if (isWishListLoading) {
    return null;
  }

  if (isWishListError) {
    return <PageError error={wishListError} />;
  }

  if (!wishListData.length) {
    return <PageError description={rn2br('위시리스트가 비어 있습니다\r\n상품을 발견하고 추가해보세요')} />;
  }

  return (
    <Wrapper>
      <TitleSection title="위시리스트" />
      <GoodsList
        goodsList={wishListData}
        infiniteOptions={{ rootMargin: '50px' }}
        disabled={!hasMoreWishList}
        onScrolled={handleLoadWishList}
        onChangeWish={handleChangeWish}
        loading={isWishListFetching}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-bottom: 2.4rem;
`;
