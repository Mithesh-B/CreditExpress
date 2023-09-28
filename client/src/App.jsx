import Login from "./loginAPI/login.jsx";
import Dashboard from "./dashboard/dashboard.jsx";
import RegisterPage from "./register/register.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const signIn = sessionStorage.getItem("isLoggedIn");

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={signIn ? <Dashboard /> : <Login />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
