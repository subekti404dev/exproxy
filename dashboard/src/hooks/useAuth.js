import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";

export const useAuth = () => {
  const { hash, setHash } = useContext(AuthContext);
  const logout = () => {
    setHash("");
  };
  return {
    hash,
    setHash,
    logout,
  };
};
