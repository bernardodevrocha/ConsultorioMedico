import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadPatients() {
    setLoading(true);
    try {
      const response = await api.get("/patients");
      setPatients(response.data);
    } catch (err) {
      setError("Erro ao carregar pacientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/patients", form);
      setForm({ name: "", birthDate: "", phone: "", email: "", notes: "" });
      loadPatients();
    } catch (err) {
      setError("Erro ao salvar paciente.");
    } finally {
      setSaving(false);
    }
  }

  const filteredPatients = patients.filter((p) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      p.name?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.phone?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Pacientes</h1>
          <span>Cadastre e visualize seus pacientes.</span>
        </div>
      </div>
      {error && <div className="alert">{error}</div>}
      <form className="card card-inline" onSubmit={handleSubmit}>
        <h2>Novo paciente</h2>
        <div className="grid-2">
          <label>
            Nome
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Nome completo do paciente"
            />
          </label>
          <label>
            Data de nascimento
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Telefone
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
            />
          </label>
          <label>
            E-mail
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="paciente@exemplo.com"
            />
          </label>
        </div>
        <label>
          Observações
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Histórico clínico, alergias, observações importantes..."
          />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar paciente"}
        </button>
      </form>

      <div className="card">
        <div className="card-header-row">
          <h2>Lista de pacientes</h2>
          <input
            className="input-search"
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="muted">Carregando pacientes...</p>
        ) : filteredPatients.length === 0 ? (
          <p className="table-empty">
            Nenhum paciente encontrado. Ajuste a busca ou cadastre um novo.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Data de nascimento</th>
                <th>Telefone</th>
                <th>E-mail</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.birthDate}</td>
                  <td>{p.phone}</td>
                  <td>{p.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

