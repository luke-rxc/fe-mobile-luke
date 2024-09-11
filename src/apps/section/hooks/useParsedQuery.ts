import qs from 'qs';
import isNaN from 'lodash/isNaN';
import isBoolean from 'lodash/isBoolean';
import { useLocation } from 'react-router-dom';

type QueryValueType = string | string[];

type ParseOptions = qs.IParseOptions & {
  parseBooleans?: boolean;
  parseNumbers?: boolean;
};

export type QueryString = Record<string, QueryValueType>;

const parseWithCustomOptions = (queryString: string, options: ParseOptions) => {
  const parsed = qs.parse(queryString, options);

  if (options.parseBooleans) {
    Object.entries(parsed).forEach(([key, value]) => {
      if (typeof value === 'string' && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
        parsed[key] = value.toLowerCase() === 'true';
      }
    });
  }

  if (options.parseNumbers) {
    Object.entries(parsed).forEach(([key, value]) => {
      if (!isNaN(Number(value)) && !isBoolean(value)) {
        parsed[key] = Number(value);
      }
    });
  }

  return parsed;
};

export const useParsedQuery = <T = QueryString>(options?: ParseOptions): Partial<T> => {
  const { search } = useLocation();

  return parseWithCustomOptions(search, {
    ignoreQueryPrefix: true,
    ...options,
  }) as Partial<T>;
};
