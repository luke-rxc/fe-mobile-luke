import qs from 'qs';
import env from '@env';
import { AppLink, AppLinkTypes, WebLink, WebLinkTypes, UniversalLink, UniversalLinkTypes } from '@constants/link';
import { compile, ParseOptions, TokensToRegexpOptions } from 'path-to-regexp';

/** @todo server base url 적용 여부 */
const { cdnUrl } = env.endPoint;
const { appLinkUrl } = env.app;

/**
 * 존재하는 String(existStr) 에 QueryParam 을 String 으로 변환하여 추가
 * @param existStr 존재하는 String
 * @param query Query Param
 * @returns
 */
const getAddQuery = (existStr: string, query: Record<string, string | number | boolean> | undefined): string => {
  // eslint-disable-next-line no-nested-ternary
  return query
    ? existStr.indexOf('?') > -1
      ? qs.stringify(query)
      : qs.stringify(query, { addQueryPrefix: true })
    : '';
};

export interface CompileLink {
  (path: string, params?: CompileLinkParams, options?: CompileLinkOptions): string;
}

type CompileLinkParams = Record<string, string | number | boolean>;

interface CompileLinkOptions extends ParseOptions, TokensToRegexpOptions {
  query?: Record<string, string | number | boolean>;
}

/**
 * Valid URL 반환
 *
 * @description 프로토콜이 포함된 경우 origin을 별도로 분리하여 반환
 */
const getValidUrl = (path: string) => {
  const protocols = ['http://', 'https://'];

  if (protocols.some((protocol) => path.startsWith(protocol))) {
    const { origin } = new URL(path);

    // URL Object로 반환된 값들은 정규표현식 구문 손실이 발생하여 path의 replace를 통해 처리함
    return { origin, sourcePath: path.replace(origin, '') };
  }

  return { origin: '', sourcePath: path };
};

/**
 * Compile Link
 *
 * 표현식 Path에 Params 및 Option을 적용하여 컴파일된 주소를 반환
 */
const compileLink: CompileLink = (path, params, options = {}) => {
  const { query, encode = encodeURIComponent, sensitive = true, ...other } = options;
  const { origin, sourcePath } = getValidUrl(path);

  const toPath = compile(sourcePath, { ...other, encode, sensitive });

  try {
    const link = origin.concat(toPath(params));

    return query ? getAddQuery(link, query) : link;
  } catch (error) {
    /** @todo 오류 처리에 대한 논의 필요 */
    return '/error';
  }
};

export interface GetLinkParams<T, R = string> {
  (type: T, params?: CompileLinkParams, options?: CompileLinkOptions): R;
}

/**
 * Web Link
 */
export const getWebLink: GetLinkParams<WebLinkTypes> = (type, params, options) => {
  const { [type]: path } = WebLink;

  return compileLink(path, params, options);
};

/**
 * App Link
 */
export const getAppLink: GetLinkParams<AppLinkTypes> = (type, params, options) => {
  const { [type]: path } = AppLink;

  return appLinkUrl.concat(compileLink(path, params, options));
};

/**
 * To App Link
 *
 * getAppLink를 통해 반환된 주소를 location.href 처리
 */
export const toAppLink: GetLinkParams<AppLinkTypes, void> = (...args) => {
  window.location.href = getAppLink(...args);
};

/**
 * Universal Link (범용)
 */
export const getUniversalLink: GetLinkParams<UniversalLinkTypes, { web: string; app: string }> = (
  type,
  params,
  options,
) => {
  const { [type]: paths } = UniversalLink;

  return {
    web: compileLink(paths.web, params, options),
    app: appLinkUrl.concat(compileLink(paths.app, params, options)),
  };
};

/**
 * 이미지 URL
 *
 * @example
 *   1. CDN URL 추가
 *   getImageLink('/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png')
 *   -> https://cdn-image-dev.prizm.co.kr/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png
 *   2. 전체 URL인 경우 ORIGIN 변경하지 않음
 *   getImageLink('https://example.com/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png')
 *   -> https://example.com/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png
 *   3. width 인자가 있는 경우
 *   getImageLink('https://cdn-image-dev.prizm.co.kr/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png', 192)
 *   -> https://cdn-image-dev.prizm.co.kr/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png?im=Resize,width=192
 *   4. width 인자가 있고, QueryString이 이미 있는 경우
 *   getImageLink('https://cdn-image-dev.prizm.co.kr/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png?im=Resize,width=32', 192)
 *   -> https://cdn-image-dev.prizm.co.kr/showroom/20211109/c1d8aa4e-54a3-457e-949b-6f956d87d2ab.png?im=Resize,width=32
 */
export const getImageLink = (url: string, width?: number) => {
  const imageUrl = addOrigin(url);

  const { href, search } = new URL(imageUrl);

  if (width) {
    return search ? href : `${href}?im=Resize,width=${width}`;
  }

  return imageUrl;
};

function addOrigin(url: string) {
  const fullUrl = [url];

  try {
    const { href } = new URL(url);

    return href;
  } catch (err) {
    fullUrl.unshift(cdnUrl);
  }

  return fullUrl.join('/');
}
