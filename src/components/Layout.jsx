import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role;

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Consultório</h2>
        {user && <p className="sidebar-user">Olá, {user.name}</p>}
        <nav>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/patients"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Pacientes
          </NavLink>
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Consultas
          </NavLink>
          {role === "admin" && (
            <span className="pill" style={{ marginTop: 8 }}>
              Admin
            </span>
          )}
        </nav>
        <button className="btn-logout" onClick={handleLogout}>
          Sair
        </button>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

