import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import { AuthContextProvider } from "./contexts/auth.context";
import Router from "./routes/router";

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter basename="/_admin">
        <ConfigProvider>
          <Router />
        </ConfigProvider>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
