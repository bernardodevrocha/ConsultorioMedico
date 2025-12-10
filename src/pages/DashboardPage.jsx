import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardPage() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    scheduled: 0,
    done: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [patientsRes, appointmentsRes] = await Promise.all([
          api.get("/patients"),
          api.get("/appointments"),
        ]);

        const patients = patientsRes.data || [];
        const appointments = appointmentsRes.data || [];

        const totalPatients = patients.length;

        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);
        let todayAppointments = 0;
        let scheduled = 0;
        let done = 0;
        let cancelled = 0;

        appointments.forEach((a) => {
          const d = new Date(a.date);
          const dStr = d.toISOString().slice(0, 10);
          if (dStr === todayStr) {
            todayAppointments++;
          }
          if (a.status === "scheduled") scheduled++;
          else if (a.status === "done") done++;
          else if (a.status === "cancelled") cancelled++;
        });

        setStats({
          totalPatients,
          todayAppointments,
          scheduled,
          done,
          cancelled,
        });
      } catch (err) {
        setError("Erro ao carregar dados do dashboard.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const totalAppointments =
    stats.scheduled + stats.done + stats.cancelled || 1;

  function percent(value) {
    return Math.round((value / totalAppointments) * 100);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          {user && (
            <span>
              Bem-vindo(a) de volta, {user.name}. Acompanhe o movimento do
              consultório.
            </span>
          )}
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="label">Pacientes ativos</span>
          <strong className="value">{stats.totalPatients}</strong>
          <span className="hint muted">
            Total de pacientes cadastrados no sistema.
          </span>
        </div>
        <div className="dashboard-card">
          <span className="label">Consultas hoje</span>
          <strong className="value">{stats.todayAppointments}</strong>
          <span className="hint muted">
            Agendadas para a data de hoje.
          </span>
        </div>
        <div className="dashboard-card">
          <span className="label">Consultas em aberto</span>
          <strong className="value">{stats.scheduled}</strong>
          <span className="hint muted">Ainda não realizadas.</span>
        </div>
      </div>

      <div className="card card-inline">
        <h2>Distribuição de status das consultas</h2>
        {loading ? (
          <p className="muted">Carregando informações...</p>
        ) : totalAppointments === 1 &&
          stats.scheduled + stats.done + stats.cancelled === 0 ? (
          <p className="table-empty">
            Ainda não há consultas registradas. Agende a primeira para ver o
            gráfico.
          </p>
        ) : (
          <div className="chart">
            <div className="chart-row">
              <span className="chart-label">Agendadas</span>
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar chart-bar-scheduled"
                  style={{ width: `${percent(stats.scheduled)}%` }}
                />
              </div>
              <span className="chart-value">
                {stats.scheduled} ({percent(stats.scheduled)}%)
              </span>
            </div>
            <div className="chart-row">
              <span className="chart-label">Realizadas</span>
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar chart-bar-done"
                  style={{ width: `${percent(stats.done)}%` }}
                />
              </div>
              <span className="chart-value">
                {stats.done} ({percent(stats.done)}%)
              </span>
            </div>
            <div className="chart-row">
              <span className="chart-label">Canceladas</span>
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar chart-bar-cancelled"
                  style={{ width: `${percent(stats.cancelled)}%` }}
                />
              </div>
              <span className="chart-value">
                {stats.cancelled} ({percent(stats.cancelled)}%)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

