import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});
export const AuthContextProvider = ({ children }) => {
  const [hash, setHashState] = useState("");

  const getHashFromLS = async () => {
    const lsHash = localStorage.getItem("hash");
    setHashState(lsHash);
    window.hash = lsHash;
  };

  const setHash = (hash) => {
    setHashState(hash);
    localStorage.setItem("hash", hash);
    window.hash = hash;
  };

  useEffect(() => {
    getHashFromLS();
    // eslint-disable-next-line
  }, []);

  const values = { hash, setHash };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
