import User from '../models/User.js';

export async function listDoctors(req, res) {
  try {
    const doctors = await User.findAll({
      where: { role: 'doctor' },
      attributes: ['id', 'name', 'email']
    });
    return res.json(doctors);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao listar médicos' });
  }
}

