import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface AxiosCreateModel {
  baseURL: string;
  headers?: Record<string, unknown>;
  withCredentials: boolean;
  config?: AxiosRequestConfig;
}

export interface ErrorInfoModel {
  field: string;
  reason: string;
  value: string;
}

export interface ErrorDataModel {
  title?: string;
  message: string;
  timestamp: number;
  code: string;
  errors: Array<ErrorInfoModel>;
}

export interface ErrorModel<T = ErrorDataModel> {
  data: T | undefined;
  message: string;
  status: number | undefined;
  config: AxiosRequestConfig;
}

function axiosResponseToData<T>(res: AxiosResponse<T>): T {
  return res.data;
}

function axiosErrorToData<T>({ response, message, config }: AxiosError<T>): ErrorModel<T> {
  return {
    data: response?.data,
    message,
    status: response?.status,
    config,
  };
}

function axiosErrorRedirects({ response }: AxiosError) {
  // if response status code is 302 redirect
  if (typeof response !== 'undefined' && response.status === 302) {
    const { location } = response.headers as Record<string, string>;

    if (typeof location === 'string') {
      window.location.replace(location);
    }
  }
}

export const createAxios = ({ baseURL, headers, withCredentials = false, config }: AxiosCreateModel) => {
  const request = axios.create({
    baseURL,
    headers: {
      common: headers,
    },
    withCredentials,
    ...config,
  });

  request.interceptors.response.use(
    (__) => __,
    (error) => {
      if (!axios.isCancel(error)) {
        // exception
      }
      return Promise.reject(error);
    },
  );

  return {
    ...request,
    async get<Response, Params = Record<string, unknown>, Error = void>(
      url: string,
      params?: Params,
      _config?: AxiosRequestConfig,
    ) {
      try {
        const res = await request.get<Response>(url, { ..._config, params });
        return axiosResponseToData(res);
      } catch (error) {
        axiosErrorRedirects(error as AxiosError);

        return Promise.reject(axiosErrorToData<Error>(error as AxiosError<Error>));
      }
    },
    /** @todo type check */
    async post<Response, Data = Record<symbol, unknown>, Error = void>(url: string, data?: Data) {
      try {
        const res = await request.post<Response>(url, data);
        return axiosResponseToData(res);
      } catch (error) {
        return Promise.reject(axiosErrorToData<Error>(error as AxiosError<Error>));
      }
    },
    async put<Response, Data = Record<string, unknown>, Error = void>(
      url: string,
      data?: Data,
      _config?: AxiosRequestConfig,
    ) {
      try {
        const res = await request.put<Response>(url, data, _config);
        return axiosResponseToData(res);
      } catch (error) {
        return Promise.reject(axiosErrorToData<Error>(error as AxiosError<Error>));
      }
    },
    async delete<Response, Data = Record<string, unknown>, Error = void>(url: string, data?: Data) {
      try {
        const res = await request.delete<Response>(url, { data });
        return axiosResponseToData(res);
      } catch (error) {
        return Promise.reject(axiosErrorToData<Error>(error as AxiosError<Error>));
      }
    },
  };
};
