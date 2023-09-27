import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./contexts/auth.context";
import Router from "./routes/router";
import { ConfigContextProvider } from "./contexts/config.contex";
import { ConfigProvider } from "antd";

function App() {
  return (
    <AuthContextProvider>
      <ConfigContextProvider>
        <BrowserRouter basename="/_admin">
          <ConfigProvider>
            <Router />
          </ConfigProvider>
        </BrowserRouter>
      </ConfigContextProvider>
    </AuthContextProvider>
  );
}

export default App;
