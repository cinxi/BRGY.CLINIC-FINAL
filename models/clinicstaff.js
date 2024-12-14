
// models
//(clinic staff)


module.exports = (sequelize, DataTypes) => {
    const ClinicStaff = sequelize.define('ClinicStaff', { 
        Users_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Users_Birthdate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        Users_Gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ContactNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Users_Status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ClinicStaff',
        timestamps: true // Ensure timestamps are enabled
      });
  

    return ClinicStaff;
};
