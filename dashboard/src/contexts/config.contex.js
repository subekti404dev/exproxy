import { createContext, useState } from "react";

export const ConfigContext = createContext({});
export const ConfigContextProvider = ({ children }) => {
  const [config, setConfig] = useState({});

  const values = { config, setConfig };
  return (
    <ConfigContext.Provider value={values}>{children}</ConfigContext.Provider>
  );
};
