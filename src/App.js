import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import SalesFormPage from "./pages/SalesFormPage";
import Layout from "./components/Layout";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/consultorio-virtual" element={<SalesFormPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <PrivateRoute>
              <Layout>
                <PatientsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <Layout>
                <AppointmentsPage />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}
