import React, { useState } from "react";

export default function SalesFormPage() {
  const [form, setForm] = useState({
    clinicName: "",
    contactName: "",
    email: "",
    phone: "",
    doctorsCount: "",
    message: "",
  });

  const [sent, setSent] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Aqui poderia enviar para uma API/ferramenta de CRM.
    console.log("Lead consultório virtual:", form);
    setSent(true);
  }

  return (
    <div className="login-page">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Garanta seu consultório virtual</h1>
        <p>
          Preencha os dados abaixo para que nossa equipe de vendas entre em
          contato com você e apresente a solução ideal para o seu consultório.
        </p>

        {sent && (
          <div className="alert" style={{ background: "#dcfce7", color: "#166534" }}>
            Recebemos suas informações! Em breve nossa equipe entrará em contato.
          </div>
        )}

        <label>
          Nome da clínica / consultório
          <input
            name="clinicName"
            value={form.clinicName}
            onChange={handleChange}
            required
            placeholder="Clínica Exemplo"
          />
        </label>
        <label>
          Nome do responsável
          <input
            name="contactName"
            value={form.contactName}
            onChange={handleChange}
            required
            placeholder="Seu nome"
          />
        </label>
        <label>
          E-mail para contato
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="contato@clinica.com"
          />
        </label>
        <label>
          Telefone / WhatsApp
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="(11) 99999-9999"
          />
        </label>
        <label>
          Quantidade aproximada de médicos
          <input
            name="doctorsCount"
            value={form.doctorsCount}
            onChange={handleChange}
            placeholder="Ex.: 3 médicos"
          />
        </label>
        <label>
          Mensagem adicional
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Conte um pouco sobre a sua clínica e o que você busca..."
          />
        </label>

        <button type="submit">
          Enviar interesse
        </button>
      </form>
    </div>
  );
}

