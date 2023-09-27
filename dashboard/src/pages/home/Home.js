import { useEffect } from "react";
import http from "../../utils/http";

const HomePage = () => {
  const getConfig = async () => {
    const res = await http.get("/config");
    console.log(res.data);
  };

  useEffect(() => {
    getConfig();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      Logged In
    </div>
  );
};

export default HomePage;
