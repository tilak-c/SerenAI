import { BrowserRouter, Routes, Route } from "react-router-dom";
import  AuthProvider  from "./contexts/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

import Sidebar from "./components/Sidebar";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState } from "react";

export default function App() {
  const [activeChat, setActiveChat] = useState(null);

  return (
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div style={{ display: "flex", height: "100vh" }}>
  <Sidebar onSelectChat={setActiveChat} />
  <Chat activeChat={activeChat} />
</div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div style={{ display: "flex", height: "100vh" }}>
                  <Sidebar onSelectChat={setActiveChat} />
                  <Dashboard />
                </div>
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
  );
}