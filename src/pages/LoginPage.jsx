import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erro ao fazer login. Verifique seus dados."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleForgotPassword() {
    alert(
      "Para redefinir sua senha, entre em contato com a equipe responsável pelo sistema ou com o suporte da clínica."
    );
  }

  function handleGoToSalesForm() {
    navigate("/consultorio-virtual");
  }

  return (
    <div className="login-page">
      <form className="card" onSubmit={handleSubmit}>
        <div className="card-header-login">
          <div>
            <h1>Consultório Médico</h1>
            <p>Entre com suas credenciais para acessar o painel.</p>
          </div>
          <button
            type="button"
            className="btn-cta"
            onClick={handleGoToSalesForm}
          >
            Garantir consultório virtual
          </button>
        </div>

        {error && <div className="alert">{error}</div>}

        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="voce@clinica.com"
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div className="muted" style={{ marginTop: 12 }}>
          Esqueceu sua senha?{" "}
          <button
            type="button"
            onClick={handleForgotPassword}
            style={{
              background: "none",
              border: "none",
              color: "#1b4b66",
              cursor: "pointer",
              padding: 0,
              fontWeight: 500,
            }}
          >
            Esqueci minha senha
          </button>
        </div>
      </form>
    </div>
  );
}

