import type { SEOProps } from '@pui/seo';
import { getImageLink } from '@utils/link';
import type { ThrillSimpleSchema } from '../schemas';

interface ThrillMetaModel {
  code: string;
  seo: SEOProps;
}

export const toThrillMetaModel = (raw: ThrillSimpleSchema): ThrillMetaModel => {
  const { code, description, thumbnail } = raw;

  return {
    code,
    seo: {
      title: '프리즘',
      description,
      type: 'website',
      image: thumbnail?.path && getImageLink(thumbnail?.path),
      siteName: 'PRIZM',
      url: window.location.origin.concat(window.location.pathname),
    },
  };
};
