import 'dotenv/config';
import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import { sequelize as pgSequelize } from './src/config/database.js';
import User from './src/models/User.js';
import Patient from './src/models/Patient.js';
import Appointment from './src/models/Appointment.js';

async function migrate() {
  const mysqlConnection = await mysql.createConnection({
    host: process.env.MYSQL_OLD_HOST,
    user: process.env.MYSQL_OLD_USER,
    password: process.env.MYSQL_OLD_PASSWORD,
    database: process.env.MYSQL_OLD_DB,
  });

  try {
    await pgSequelize.authenticate();
    await pgSequelize.sync();

    const [users] = await mysqlConnection.execute('SELECT * FROM users');
    const [patients] = await mysqlConnection.execute('SELECT * FROM patients');
    const [appointments] = await mysqlConnection.execute(
      'SELECT * FROM appointments'
    );

    await pgSequelize.transaction(async (t) => {
      await Appointment.destroy({ where: {}, truncate: true, transaction: t });
      await Patient.destroy({ where: {}, truncate: true, cascade: true, transaction: t });
      await User.destroy({ where: {}, truncate: true, cascade: true, transaction: t });

      for (const u of users) {
        await User.create(
          {
            id: u.id,
            name: u.name,
            email: u.email,
            passwordHash: u.password_hash || u.passwordHash,
            role: u.role || 'doctor',
          },
          { transaction: t }
        );
      }

      for (const p of patients) {
        await Patient.create(
          {
            id: p.id,
            name: p.name,
            birthDate: p.birth_date || p.birthDate,
            phone: p.phone,
            email: p.email,
            notes: p.notes,
          },
          { transaction: t }
        );
      }

      for (const a of appointments) {
        await Appointment.create(
          {
            id: a.id,
            date: a.date,
            reason: a.reason,
            status: a.status || 'scheduled',
            cancelReason: a.cancel_reason || a.cancelReason,
            patientId: a.patient_id || a.patientId,
            doctorId: a.doctor_id || a.doctorId,
          },
          { transaction: t }
        );
      }
    });

    console.log('Migração concluída com sucesso.');
  } catch (error) {
    console.error('Erro durante migração:', error);
  } finally {
    await mysqlConnection.end();
    await pgSequelize.close();
  }
}

migrate();

