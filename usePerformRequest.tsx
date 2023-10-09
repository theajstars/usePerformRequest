import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
interface RequestOptions {
  method: "POST" | "GET" | "PUT";
  url: string;
  body?: any;
}
function usePerformRequest<Type>({ method, url, body }: RequestOptions) {
  const [data, setData] = useState<Type>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const reloadData = async () => {
    const config: AxiosRequestConfig = {
      method,
      data: body,
      url,
    };
    setLoading(true);
    const r = await axios(config);
    setLoading(false);
    if (r.data) {
      setData(r.data);
    }
  };
  useEffect(() => {
    reloadData().catch(() => setLoading(false));
  }, [url]);

  return { data, isLoading, reloadData };
}

export { usePerformRequest };
