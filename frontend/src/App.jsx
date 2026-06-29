import "./App.css";
import { BrowserRouter,  Routes, Route,  Navigate,} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ToastProvider from "./components/ToastProvider";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPasswordPage from "./pages/Forgot-password";

import { HomePage } from "./pages/Home";
import ProfilePage from "./pages/Profile";

import DashboardPage from "./pages/admin/Dashboard";
import SettingPage from "./pages/admin/Setting";

import ProtectedRoute from "./routes/ProtectedRoute";
import LoginRoute from "./routes/LoginRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {
  const { user, loading } = useAuth();

  return (
    <BrowserRouter>
      <ToastProvider />
      <Routes>
        {/* Public */}
       <Route path="/login" element={<LoginRoute user={user} loading={loading}> <Login /> </LoginRoute>}/>
        <Route path="/register"  element={<LoginRoute user={user} loading={loading}> <Register/> </LoginRoute>}/>
        <Route path="/forgot-password" element={<LoginRoute user={user} loading={loading}> <ForgotPasswordPage/> </LoginRoute> }/>
        {/* User */}
        <Route path="/home" element={ <ProtectedRoute user={user} loading={loading}><HomePage user={user} /></ProtectedRoute> } />
        <Route path="/profile"  element={ <ProtectedRoute user={user} loading={loading}> <ProfilePage /></ProtectedRoute> }/>
        {/* Admin */}
        <Route path="/admin/dashboard" element={ <AdminRoute user={user} loading={loading}> <DashboardPage /> </AdminRoute>} />
        <Route path="/admin/setting" element={ <AdminRoute user={user} loading={loading} ><SettingPage /></AdminRoute> }/>
        {/* Root */}
        <Route path="/" element={ <Navigate replace to={ !user ? "/login" : user.role === "admin" ? "/admin/dashboard" : "/home" }  />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;