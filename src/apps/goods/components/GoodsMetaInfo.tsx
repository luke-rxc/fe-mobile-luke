import { useLocation } from 'react-router-dom';
import env from '@env';
import { MetaAttribute, SEO } from '@pui/seo';
import { getImageLink } from '@utils/link';
import { GoodsModel } from '../models';

interface Props {
  detailGoods?: GoodsModel;
  scalable?: boolean;
}

export const GoodsMetaInfo = ({ detailGoods, scalable = false }: Props) => {
  const { pathname } = useLocation();
  const keywords = detailGoods?.keyword.map((value) => value.name);
  const imageUrl = detailGoods && getImageLink(detailGoods.primaryImage.path);
  const url = `${env.endPoint.baseUrl}${pathname}`;
  const metaScalable: MetaAttribute[] = [];

  scalable &&
    metaScalable.push({
      name: 'viewport',
      content:
        'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=2, user-scalable=yes, shrink-to-fit=no, viewport-fit=cover',
    });

  return (
    <SEO
      title={detailGoods?.name}
      description={detailGoods?.description}
      image={imageUrl}
      keywords={keywords}
      url={url}
      meta={metaScalable}
      helmetProps={{ title: detailGoods?.name, defer: scalable }}
    />
  );
};
