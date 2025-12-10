import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';

export async function listAppointments(req, res) {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'name'] },
        { model: User, as: 'doctor', attributes: ['id', 'name'] }
      ],
      order: [['date', 'ASC']]
    });
    return res.json(appointments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao listar consultas' });
  }
}

export async function createAppointment(req, res) {
  try {
    const { patientId, doctorId, date, reason } = req.body;
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      reason
    });
    return res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar consulta' });
  }
}

export async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Consulta não encontrada' });
    }
    await appointment.update(req.body);
    return res.json(appointment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar consulta' });
  }
}

export async function deleteAppointment(req, res) {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Consulta não encontrada' });
    }
    await appointment.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao excluir consulta' });
  }
}

