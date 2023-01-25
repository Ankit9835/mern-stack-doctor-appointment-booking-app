import  "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import { Button, Space } from 'antd';
import Register from "./pages/Register";
import Home from "./pages/Home";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ApplyDoctor from "./pages/ApplyDoctor";
import Notification from "./pages/Notification";
import DoctorList from "./pages/Admin/DoctorList";
import UserList from "./pages/Admin/UserList";

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
           <PublicRoute>
             <Login /> 
           </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute> 
            <Register /> 
          </PublicRoute>
        }
      />

       <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/apply-doctor"
        element={
          <ProtectedRoute>
            <ApplyDoctor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute>
        }
      />
    

    <Route
        path="/admin/doctorslist"
        element={
          <ProtectedRoute>
            <DoctorList />
          </ProtectedRoute>
        }
      />

    <Route
        path="/admin/userslist"
        element={
          <ProtectedRoute>
            <UserList />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
