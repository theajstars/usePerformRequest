import { useEffect, useState } from "react";

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
interface RequestOptions {
  method: "POST" | "GET" | "PUT" | "DELETE";
  url: string;
  body?: any;
}
function usePerformRequest<Type>({ method, url, body }: RequestOptions) {
  const [data, setData] = useState<Type>();
  const [response, setResponse] = useState<AxiosResponse>();
  const [error, setError] = useState<AxiosError>();
  const [status, setStatus] = useState<number | string>("undefined");
  const [isLoading, setLoading] = useState<boolean>(false);
  const reloadData = async () => {
    // (Optional) Import Auth Token
    const token = localStorage.getItem("token");

    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
      data: body,
      url,
    };

    setLoading(true);
    const r: any = await axios.request(config).catch((e: AxiosError) => {
      setError(e);
      setStatus(e.response?.status as number);

      return {
        status: e.response?.status,
      };
    });

    setResponse(r as AxiosResponse);
    setStatus(r.status);
    setLoading(false);
    setData(r?.data ?? undefined);
  };
  useEffect(() => {
    reloadData().catch(() => setLoading(false));
  }, [url]);

  return { data, response, isLoading, reloadData, status, error };
}

interface PerformRequestOptions {
  method: "POST" | "PATCH" | "GET" | "PUT";
  data?: any;
  route: string;
  headers?: any;
  doNotUseAuthorization?: boolean;
  callback?: () => any;
}

async function PerformRequest<Type>({
  method,
  data,
  route,
  callback,
}: PerformRequestOptions) {
  // (Optional) Import Auth Token
  const token = localStorage.getItem("token");

  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    data,
    url: route,
  };

  const r: any = await axios.request(config).catch((e: AxiosError) => {
    if (callback) {
      callback();
    }
    return {
      status: e.response?.status,
      data: (e?.response?.data as any)?.data,
    };
  });
  return {
    status: r.status as number,
    data: r?.data as Type,
    message: r?.message ?? undefined,
  };
}
export { usePerformRequest, PerformRequest };
