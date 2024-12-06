module.exports = (sequelize, DataTypes) => {
    const admin = sequelize.define('admin', {  
        Admin_ID: { 
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
        Admin_Birthdate: { 
            type: DataTypes.DATE,
            allowNull: false
        },
        Admin_Gender: { 
            type: DataTypes.STRING,
            allowNull: false
        },
        ContactNumber: {
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
        modelName: 'admin',
        timestamps: true // Ensure timestamps are enabled
      });
    
  
    return admin; 
  };