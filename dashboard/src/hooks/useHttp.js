import http from "../utils/http";
import { useAuth } from "./useAuth";

export const useHttp = () => {
  const { hash } = useAuth();
  return {
    request: http(hash),
  };
};
