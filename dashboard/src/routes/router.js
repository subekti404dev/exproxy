import { useAuth } from "../hooks/useAuth";
import LoginForm from "../pages/login/Login";
import HomePage from "../pages/home/Home";

function Router() {
  const { hash } = useAuth();

  if (!hash) {
    return <LoginForm />;
  }
  return <HomePage />;
}

export default Router;
