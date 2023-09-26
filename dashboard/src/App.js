import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Login from "./pages/login/Login";
import { ConfigProvider } from "antd";
import { AuthContextProvider } from "./contexts/auth.context";

function App() {
  return (
    <BrowserRouter basename="/_admin">
      <AuthContextProvider>
        <ConfigProvider>
          <Login />
        </ConfigProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
