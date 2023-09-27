import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";

export const useAuth = () => {
  const { hash, setHash } = useContext(AuthContext);
  return {
    hash,
    setHash,
  };
};
