'use strict';
module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define('Patient', {
    Patient_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Patient_FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Patient_LastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Patient_Gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DateofBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Patient_ContactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Patient_Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Patient_Status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
      sequelize,
      modelName: 'Patient',
      timestamps: true // Ensure timestamps are enabled
    });



  return Patient;
};
