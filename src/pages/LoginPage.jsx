import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
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
      if (mode === "login") {
        const response = await api.post("/auth/login", { email, password });
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else {
        await api.post("/auth/register", {
          name,
          email,
          password,
          role: "doctor",
        });
        const response = await api.post("/auth/login", { email, password });
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (mode === "login"
            ? "Erro ao fazer login. Verifique seus dados."
            : "Erro ao criar conta. Verifique os dados.")
      );
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <div className="login-page">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Consultório Médico</h1>
        <p>
          {isLogin
            ? "Entre com suas credenciais para acessar o painel."
            : "Preencha seus dados para criar uma conta."}
        </p>
        {error && <div className="alert">{error}</div>}

        {!isLogin && (
          <label>
            Nome
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Seu nome completo"
            />
          </label>
        )}

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
          {loading
            ? isLogin
              ? "Entrando..."
              : "Criando conta..."
            : isLogin
            ? "Entrar"
            : "Criar conta"}
        </button>

        <div className="muted" style={{ marginTop: 12 }}>
          {isLogin ? (
            <>
              Ainda não tem conta?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1b4b66",
                  cursor: "pointer",
                  padding: 0,
                  fontWeight: 500,
                }}
              >
                Criar uma conta
              </button>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1b4b66",
                  cursor: "pointer",
                  padding: 0,
                  fontWeight: 500,
                }}
              >
                Fazer login
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

