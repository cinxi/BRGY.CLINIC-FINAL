
//model
//appointment

'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association: Appointment belongs to Patient
      Appointment.belongsTo(models.Patient, {
        foreignKey: 'Patient_ID',
        as: 'Patient'
      });
    }


  }



  Appointment.init({
    Appointment_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Patient_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Users_ID: {
      type: DataTypes.INTEGER,
      allowNull: true // Allow NULL temporarily
    },
    Appointment_Date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Appointment_Time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Appointment_Purpose: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Appointment_Status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Appointment',
    timestamps: true // Ensure timestamps are enabled
  });


  return Appointment;
};
