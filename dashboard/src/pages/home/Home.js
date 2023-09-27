import { useEffect } from "react";
import { useHttp } from "../../hooks/useHttp";

const HomePage = () => {
  const { request } = useHttp();

  const getConfig = async () => {
    const res = await request.get("/config");
    console.log(res.data);
  };

  useEffect(() => {
    getConfig();
    // eslint-disable-next-line
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
