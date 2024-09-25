import { baseURL } from "../constants";
import { resInterceptor } from "./intercepters";
import axios from "axios";

interface IRequestParams {
  method?: string;
  url: string;
  data?: unknown;
  params?: unknown;
  config?: any;
}

export class NetworkService {
  [x: string]: any;
  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:3001/api/",
    });
    this.client.interceptors.response.use(
      resInterceptor.onFulfill,
      resInterceptor.onReject
    );
  }

  request({ method, url, data, baseURL = "", config = {} }) {
    return this.client.request({
      method,
      url,
      data,
      baseURL: baseURL || undefined,
      ...config,
    });
  }
  get({ url, config }: IRequestParams) {
    return this.client.get(url, { ...config });
  }

  post({ url, data, config }: IRequestParams) {
    return this.client.post(url, data, { ...config });
  }
}

export const client = new NetworkService();
