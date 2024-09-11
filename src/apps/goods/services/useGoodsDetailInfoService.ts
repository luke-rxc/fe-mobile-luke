import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@hooks/useQuery';
import { FilterBarProps } from '@features/filter';
import { getGoodsDetailInfo, getGoodsDetailInfoOnda } from '../apis';
import { GoodsDetailInfoType, QueryKeys } from '../constants';
import { DetailInfoModel, toDetailInfo, toDetailInfoOnda } from '../models';
import { DetailInfoOndaSchema } from '../schemas';
import { useGoodsDetailLogService } from './useGoodsDetailLogService';

interface Props {
  goodsId: number;
  type?: string;
}

export const useGoodsDetailInfoService = ({ goodsId, type }: Props) => {
  const { logTabDetailInfo: handleLogTabDetailInfo } = useGoodsDetailLogService();

  const [tabValue, setTabValue] = useState<number>(0);
  const [scrolling, setScrolling] = useState<boolean>(false);

  const isOndaDeal = type === GoodsDetailInfoType.ONDA;

  const detailInfoQuery = useQuery([QueryKeys.DETAIL_INFO, goodsId], () => getGoodsDetailInfo({ goodsId }), {
    select: (data) => toDetailInfo(data),
    enabled: !isOndaDeal,
  });

  const ondaQuery = useQuery([QueryKeys.DETAIL_INFO_ONDA, goodsId], () => getGoodsDetailInfoOnda({ goodsId }), {
    select: (data) => toDetailInfoOnda(data),
    enabled: isOndaDeal,
  });

  const handleChangeTab: Required<FilterBarProps<string>>['category']['onChange'] = (
    _,
    name: string,
    index: number,
  ) => {
    setTabValue(index);
    handleLogTabDetailInfo(goodsId, name);
  };

  const handleScroll = useCallback(() => {
    setScrolling(window.scrollY > 0);
  }, []);

  const query = isOndaDeal ? ondaQuery : detailInfoQuery;

  const tabList = query.data && isOndaDeal && (query.data as DetailInfoOndaSchema).tabs.map(({ name }) => name);
  const sectionList =
    query.data &&
    (isOndaDeal ? (query.data as DetailInfoOndaSchema).tabs[tabValue]?.sections : (query.data as DetailInfoModel[]));

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { query, isOndaDeal, tabList, tabValue, sectionList, scrolling, handleChangeTab };
};
