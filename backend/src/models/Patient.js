import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Patient = sequelize.define(
  'Patient',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'birth_date'
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'patients'
  }
);

export default Patient;
