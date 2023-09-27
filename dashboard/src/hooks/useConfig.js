import { useContext, useEffect } from "react";
import { useHttp } from "./useHttp";
import { ConfigContext } from "../contexts/config.contex";
import { message } from "antd";

export const useConfig = () => {
  const { request } = useHttp();
  const { config, setConfig } = useContext(ConfigContext);

  const getConfig = async () => {
    const res = await request.get("/config");
    setConfig(res.data?.data || {});
  };

  const updateConfig = async (val = {}) => {
    try {
      const res = await request.put("/config", { ...config, ...val });
      setConfig(res.data?.data || {});
      message.success("Config Updated");
    } catch (error) {
      message.success("Failed to Update Config");
    }
  };

  useEffect(() => {
    getConfig();
    // eslint-disable-next-line
  }, []);

  return { config, updateConfig };
};
