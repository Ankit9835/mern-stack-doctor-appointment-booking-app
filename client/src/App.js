import  "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import { Button, Space } from 'antd';
import Register from "./pages/Register";
import Home from "./pages/Home";
import { useSelector } from "react-redux";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <BrowserRouter>
    {loading && (
        <div className="spinner-parent">
          <div class="spinner-border" role="status"></div>
        </div>
      )}
     <Toaster position="top-center" reverseOrder={false} />
    <Routes>
      <Route
        path="/login"
        element={
            <Login />
        }
      />
      <Route
        path="/register"
        element={
            <Register />
        }
      />

       <Route
        path="/home"
        element={
            <Home />
        }
      />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
