import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize } from './src/config/database.js';
import authRoutes from './src/routes/auth.routes.js';
import patientRoutes from './src/routes/patient.routes.js';
import appointmentRoutes from './src/routes/appointment.routes.js';
import userRoutes from './src/routes/user.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Consultório Médico' });
});

app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/users', userRoutes);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
  }
}

start();
