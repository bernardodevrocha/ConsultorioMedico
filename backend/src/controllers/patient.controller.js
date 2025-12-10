import Patient from '../models/Patient.js';

export async function listPatients(req, res) {
  try {
    const patients = await Patient.findAll({ order: [['name', 'ASC']] });
    return res.json(patients);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao listar pacientes' });
  }
}

export async function createPatient(req, res) {
  try {
    const { name, birthDate, phone, email, notes } = req.body;
    const patient = await Patient.create({ name, birthDate, phone, email, notes });
    return res.status(201).json(patient);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar paciente' });
  }
}

export async function updatePatient(req, res) {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }
    await patient.update(req.body);
    return res.json(patient);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar paciente' });
  }
}

export async function deletePatient(req, res) {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({ message: 'Paciente não encontrado' });
    }
    await patient.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao excluir paciente' });
  }
}

