/* Cspell:disable */
import { Helmet, HelmetProps } from 'react-helmet-async';

// Meta name 속성 사용 목록
const MetaAttributeName = [
  // basic
  'keywords',
  'description',
  'viewport',

  // optional
  'theme-color',

  // Twitter
  'twitter:card',
  'twitter:description',
  'twitter:title',
  'twitter:image',
  'twitter:image:alt',
  'twitter:url',
  'twitter:site',
  'twitter:site:id',
  'twitter:creator',
  'twitter:creator:id',
  'twitter:player',
  'twitter:player:width',
  'twitter:player:height',
  'twitter:player:stream',
  'twitter:app:name:iphone',
  'twitter:app:id:iphone',
  'twitter:app:url:iphone',
  'twitter:app:name:ipad',
  'twitter:app:id:ipad',
  'twitter:app:url:ipad',
  'twitter:app:name:googleplay',
  'twitter:app:id:googleplay',
  'twitter:app:url:googleplay',

  // iOS Web
  'apple-itunes-app',
] as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
type MetaAttributeName = typeof MetaAttributeName[number];

// Meta property 속성 사용 목록
const MetaAttributeProperty = [
  // facebook
  // 'fb:app_id',

  // basic
  'og:url',
  'og:title',
  'og:description',
  'og:type',

  // optional
  'og:site_name',
  'og:determiner',
  'og:locale',
  'og:locale:alternate',

  // media audio
  'og:audio',
  'og:audio:secure_url',
  'og:audio:type',

  // media video
  'og:video',
  'og:video:url',
  'og:video:secure_url',
  'og:video:type',
  'og:video:width',
  'og:video:height',

  // media image
  'og:image',
  'og:image:url',
  'og:image:secure_url',
  'og:image:type',
  'og:image:width',
  'og:image:height',
  'og:image:alt',

  // iOS
  'al:ios:url',
  'al:ios:app_store_id',
  'al:ios:app_name',

  // Android
  'al:android:url',
  'al:android:app_name',
  'al:android:package',
  'al:web:url',
  'al:web:should_fallback',
] as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
type MetaAttributeProperty = typeof MetaAttributeProperty[number];

export type MetaAttribute = Omit<JSX.IntrinsicElements['meta'], 'name' | 'property'> & {
  name?: MetaAttributeName;
  property?: MetaAttributeProperty;
};

export interface SEOProps {
  // 동적 태그 대상 초기화
  init?: boolean;
  // og:title
  title?: string;
  // og:description
  description?: string;
  // og:type
  type?: string;
  // og:image
  image?: string;
  // og:url
  url?: string;
  // og:site_name
  siteName?: string;
  // keywords
  keywords?: string[];
  // metadata
  meta?: MetaAttribute[];
  // * React Helmet의 meta 속성은 SEO의 meta로 대체
  helmetProps?: Omit<HelmetProps, 'meta'>;
}

// Helmet 기본값
const defaultHelmetProps: HelmetProps = {
  defer: false,
  defaultTitle: 'PRIZM',
  titleTemplate: 'PRIZM | %s',
} as const;

/**
 * SEO(Search Engine Optimization) 기능이 주 목적인 컴포넌트입니다.
 * - SEO를 위한 Meta Tag는 OG(Open Graph) 프로토콜과 내부 정의 데이터를 기준으로 처리합니다.
 * - Document Head를 관리하는 Helmet의 기능을 활용하므로 Meta Tag 외 다른 Tag 또한 처리가 가능합니다.
 *
 * @example
 *   <SEO title="타이틀" description="설명" />
 *   <SEO title="타이틀" meta={[{ name: 'viewport', content: 'width=device-width' }]} />
 *   <SEO meta={[...]} helmetProps={{ defer: true, title: '프리즘' }} />
 */
export const SEO = ({
  init = false,
  title,
  description,
  type,
  image,
  url,
  siteName,
  keywords,
  meta,
  helmetProps,
}: SEOProps) => {
  // 메타데이터 목록
  const metadata: MetaAttribute[] = [];

  // 메타 번들 추가
  metadata.push(
    ...getMetaBundle('TITLE', title),
    ...getMetaBundle('DESCRIPTION', description),
    ...getMetaBundle('TYPE', type),
    ...getMetaBundle('IMAGE', image),
    ...getMetaBundle('URL', url),
    ...getMetaBundle('SITE_NAME', siteName),
    ...getMetaBundle('KEYWORDS', keywords?.toString()),
  );

  // 메타 Prop 데이터 추가
  metadata.push(...getMetaDedupe(metadata, meta));

  // 초기화 필요한 메타 추가
  init && metadata.push(...getMetaDedupe(metadata, initialize()));

  // 메타 데이터 정제
  const sanitized = sanitizeTags(metadata);

  return <Helmet {...defaultHelmetProps} {...helmetProps} meta={sanitized} />;
};

/**
 * 관리 대상의 메타 태그 Attribute 초기화 및 초기화 대상 meta 데이터 반환
 * - React Helmet으로 추가하지 않은 태그는 'data-rh' Attribute 설정이 되지 않은 경우 제어가 불가하므로 Attribute를 업데이트 합니다.
 * - React Helmet을 통해 초기화하지 않는 경우 태그가 삭제되므로 필요한 meta 데이터 구성 목록을 반환합니다.
 */
function initialize() {
  const headElement = document.head || document.querySelector('head');

  // initMetadata
  const meta: MetaAttribute[] = [];

  headElement.querySelectorAll('meta[name], meta[property]').forEach((elem) => {
    const name = elem.getAttribute('name') as MetaAttributeName | null;
    const property = elem.getAttribute('property') as MetaAttributeProperty | null;

    if ((name && MetaAttributeName.includes(name)) || (property && MetaAttributeProperty.includes(property))) {
      // React Helmet 속성으로 설정
      elem.setAttribute('data-rh', 'true');

      // 초기화 대상에 추가
      meta.push(
        [...elem.attributes].reduce<{ [key: string]: string }>(
          // data 속성은 제외
          (acc, attr) => (/^(data-).*/.test(attr.name) ? { ...acc } : { ...acc, [attr.name]: attr.value }),
          {},
        ),
      );
    }
  });

  return meta;
}

// 메타데이터 번들 타입
type BundleType = 'TITLE' | 'DESCRIPTION' | 'TYPE' | 'IMAGE' | 'URL' | 'SITE_NAME' | 'KEYWORDS';

/**
 * Prizm 기본 메타데이터 번들
 *
 * @param type 번들 타입
 * @param [value] 번틀 타입에 할당할 값
 * @returns 메타데이터 번들
 */
function getMetaBundle(type: BundleType, value?: string) {
  const meta: MetaAttribute[] = [];

  if (!value) return meta;

  switch (type) {
    case 'TITLE':
      meta.push({ property: 'og:title', content: value });
      meta.push({ name: 'twitter:title', content: value });
      break;
    case 'DESCRIPTION':
      meta.push({ property: 'og:description', content: value });
      meta.push({ name: 'twitter:description', content: value });
      meta.push({ name: 'description', content: value });
      break;
    case 'TYPE':
      meta.push({ property: 'og:type', content: value });
      meta.push({ name: 'twitter:card', content: value });
      break;
    case 'IMAGE':
      meta.push({ property: 'og:image', content: value });
      meta.push({ name: 'twitter:image', content: value });
      break;
    case 'URL':
      meta.push({ property: 'og:url', content: value });
      meta.push({ name: 'twitter:url', content: value });
      break;
    case 'SITE_NAME':
      meta.push({ property: 'og:site_name', content: value });
      break;
    case 'KEYWORDS':
      meta.push({ name: 'keywords', content: value });
      break;
    default:
      break;
  }

  return meta;
}

/**
 * 메타데이터 중복 제거
 * - configured 데이터를 기준으로 비교하여 addition 데이터를 필터링하여 새로운 배열로 반환합니다.
 *
 * @param configured 이미 구성된 메타데이터
 * @param [addition] 추가 구성할 메타데이터
 * @returns 중복 제거된 메타데이터
 */
function getMetaDedupe(configured: MetaAttribute[], addition: MetaAttribute[] = []) {
  // 중복 가능한 메타데이터 name 정규표현식
  const dupRegex = /^(og:image).*/;

  // 추가할 메타데이터의 중복 제거
  return addition?.filter(({ name, property }) => {
    // Unique key
    const key = name ?? property;
    // 중복이 가능한 메타데이터 여부
    const duplicateable = dupRegex.test(key ?? '');
    // 메타데이터가 이미 구성되었는지 여부
    const has = configured.find((item) => item.name === key || item.property === key);

    // 중복 가능하거나 이미 구성되지 않은 경우만 필터링
    return duplicateable || !has;
  });
}

/**
 * 메타데이터 권장 및 제한 스펙 적용
 *
 * @param metadata 대상 데이터
 * @returns 필터링된 새로운 데이터
 */
function sanitizeTags(metadata: MetaAttribute[]) {
  // 줄 바꿈 패턴
  const removeLineBreaksReEexp = /[\r\n]/gm;
  // Title 글자 제한 (Google 권장 스펙)
  const TITLE_MAX_LENGTH = 60;
  // Description 글자 제한 (Google 권장 스펙)
  const DESCRIPTION_MAX_LENGTH = 160;

  const sanitize = {
    title: (value: string) => value.replace(removeLineBreaksReEexp, '').trim().substring(0, TITLE_MAX_LENGTH),
    description: (value: string) =>
      value.replace(removeLineBreaksReEexp, '').trim().substring(0, DESCRIPTION_MAX_LENGTH),
  };

  const sanitized = metadata.map((meta) => {
    const { name, property, content = '' } = meta;

    switch (name || property) {
      case 'og:title':
      case 'twitter:title':
        return { ...meta, content: sanitize.title(content) };
      case 'og:description':
      case 'twitter:description':
      case 'description':
        return { ...meta, content: sanitize.description(content) };
      default:
        return { ...meta };
    }
  });

  return sanitized;
}
/* Cspell:enable */
