import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingDateId, setEditingDateId] = useState(null);
  const [editingDateValue, setEditingDateValue] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        api.get("/appointments"),
        api.get("/patients"),
        api.get("/users/doctors"),
      ]);
      setAppointments(appointmentsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
    } catch (err) {
      setError("Erro ao carregar consultas, pacientes ou médicos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/appointments", form);
      setForm({ patientId: "", doctorId: "", date: "", reason: "" });
      loadData();
    } catch (err) {
      setError("Erro ao salvar consulta.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangeStatus(appointment, newStatus) {
    try {
      let payload = { status: newStatus };

      if (newStatus === "cancelled") {
        const reason = window.prompt("Motivo do cancelamento:", appointment.cancelReason || "");
        if (reason === null) {
          return;
        }
        payload.cancelReason = reason;
      }

      await api.put(`/appointments/${appointment.id}`, payload);
      loadData();
    } catch (err) {
      setError("Erro ao atualizar status da consulta.");
    }
  }

  function startEditDate(appointment) {
    setEditingDateId(appointment.id);
    const d = new Date(appointment.date);
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setEditingDateValue(iso);
  }

  async function saveEditDate(id) {
    try {
      await api.put(`/appointments/${id}`, { date: editingDateValue });
      setEditingDateId(null);
      setEditingDateValue("");
      loadData();
    } catch (err) {
      setError("Erro ao reagendar consulta.");
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Consultas</h1>
          <span>Organize os horários de atendimento.</span>
        </div>
      </div>
      {error && <div className="alert">{error}</div>}

      <form className="card card-inline" onSubmit={handleSubmit}>
        <h2>Nova consulta</h2>
        <div className="grid-2">
          <label>
            Paciente
            <select
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o paciente...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Médico
            <select
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o médico...</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Data e hora
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Motivo
            <input
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              placeholder="Retorno, avaliação inicial..."
            />
          </label>
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar consulta"}
        </button>
      </form>

      <div className="card">
        <h2>Próximas consultas</h2>
        {loading ? (
          <p className="muted">Carregando consultas...</p>
        ) : appointments.length === 0 ? (
          <p className="table-empty">
            Nenhuma consulta agendada. Utilize o formulário acima para marcar.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Motivo</th>
                <th>Status</th>
                <th>Detalhes</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>
                    {editingDateId === a.id ? (
                      <div className="inline-edit">
                        <input
                          type="datetime-local"
                          value={editingDateValue}
                          onChange={(e) => setEditingDateValue(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => saveEditDate(a.id)}
                        >
                          Salvar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingDateId(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      new Date(a.date).toLocaleString()
                    )}
                  </td>
                  <td>{a.patient?.name || "-"}</td>
                  <td>{a.doctor?.name || "-"}</td>
                  <td>{a.reason}</td>
                  <td>
                    <select
                      value={a.status}
                      onChange={(e) => handleChangeStatus(a, e.target.value)}
                    >
                      <option value="scheduled">Agendada</option>
                      <option value="done">Realizada</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </td>
                  <td>{a.cancelReason || "-"}</td>
                  <td>
                    {a.status === "scheduled" && editingDateId !== a.id && (
                      <button
                        type="button"
                        onClick={() => startEditDate(a)}
                      >
                        Reagendar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
