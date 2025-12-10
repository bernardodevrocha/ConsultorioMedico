import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Patient from './Patient.js';
import User from './User.js';

const Appointment = sequelize.define(
  'Appointment',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'done', 'cancelled'),
      defaultValue: 'scheduled'
    },
    cancelReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cancel_reason'
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'patient_id'
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'doctor_id'
    }
  },
  {
    tableName: 'appointments'
  }
);

Patient.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

User.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointmentsAsDoctor' });
Appointment.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

export default Appointment;
