import  "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { Button, Space } from 'antd';
import Register from "./pages/Register";
function App() {
  return (
    <BrowserRouter>
    
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
     
    </Routes>
  </BrowserRouter>
  );
}

export default App;
