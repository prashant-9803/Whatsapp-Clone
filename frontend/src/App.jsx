import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Logout from "./pages/Logout";
import { useEffect, useState } from "react";

function App() {
  const { user } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  useEffect(() => {
    // Sync auth state with Redux and localStorage
    const storedUser = localStorage.getItem('user');
    setIsAuthenticated(!!user || !!storedUser);
  }, [user]); // Add user as dependency

  const GoogleAuthWrapper = () => (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Login />
    </GoogleOAuthProvider>
  );

  return (
    <div className="w-screen min-h-screen">
      <div id="photo-picker-element"></div>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <GoogleAuthWrapper />
            </PublicRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Onboarding />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/logout"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Logout />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </div>
  );
}

const PrivateRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ isAuthenticated, children }) => {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default App;
