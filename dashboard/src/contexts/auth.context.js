import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});
export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [sessionExp, setSessionExp] = useState("");

  const getTokenFromLS = async () => {
    const lsToken = localStorage.getItem("token");
    setSessionExp();
    setToken(lsToken);
  };

  useEffect(() => {
    getTokenFromLS();
  }, []);

  const values = { token, sessionExp, getTokenFromLS };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
