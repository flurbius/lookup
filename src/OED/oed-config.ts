import * as  secret from './.secret';

    export const definitions = '/entries/en/{word}';
    export const synonyms = '/entries/en/{word}/synonyms;antonyms';


    // defaults
    export const config = {
        baseURL: 'https://od-api.oxforddictionaries.com/api/v1',
        headers: {
            'app_id': secret.appid,
            'app_key': secret.appkey
        },
        method: 'get',
        maxContentLength: 50000,
        timeout: 10000,
        responseType: 'json'
    };

    /*
AxiosRequestConfig {
  url?: string;
  method?: string;
  baseURL?: string;
  transformRequest?: AxiosTransformer | AxiosTransformer[];
  transformResponse?: AxiosTransformer | AxiosTransformer[];
  headers?: any;
  params?: any;
  paramsSerializer?: (params: any) => string;
  data?: any;
  timeout?: number;
  withCredentials?: boolean;
  adapter?: AxiosAdapter;
  auth?: AxiosBasicCredentials;
  responseType?: string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  maxContentLength?: number;
  validateStatus?: (status: number) => boolean;
  maxRedirects?: number;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: AxiosProxyConfig;
  cancelToken?: CancelToken;
}



    */