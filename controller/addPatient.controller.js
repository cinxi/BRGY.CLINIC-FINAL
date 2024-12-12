//addPatient.controller.js

const { where } = require("sequelize");
const models = require("../models");
const jwt = require("jsonwebtoken");

// Render Admin Dashboard
const Admindashboard_view = (req, res) => {
    res.render("admin/Admindashboard");
};

// Render User Management Page
const usermanagement_view = (req, res) => {
    res.render("admin/usermanagement");
};

// Render Logs Page
const logs_view = (req, res) => {
    res.render("admin/logs");
};

// Render Staff Dashboard
const Staffdashboard_view = (req, res) => {
    res.render("staff/Staffdashboard");
};

// Render Patients View with Fetched Data
const patients_view = (req, res) => {
    models.Patient.findAll()
        .then(patients => {
            res.render("staff/patients", { patients });
        })
        .catch(error => {
            console.error("Error fetching patients:", error);
            res.render("staff/patients", { patients: [] });
        });
};


// Logout Function
const logout = (req, res) => {
    res.cookie("token", "", { maxAge: 1000 });
    res.render("login");
};

// Add New Patient
const save_addPatient = (req, res) => {
    const patient_data = {
        Patient_FirstName: req.body.Patient_FirstName,
        Patient_LastName: req.body.Patient_LastName,
        Patient_Gender: req.body.Patient_Gender,
        DateofBirth: req.body.DateofBirth,
        Patient_ContactNumber: req.body.Patient_ContactNumber,
        Patient_Address: req.body.Patient_Address,
    };

    console.log("Patient data:", patient_data);

    models.Patient.create(patient_data)
        .then(result => {
            console.log("Patient added successfully:", result);
            res.redirect("/staff/patients");
        })
        .catch(error => {
            console.error("Error adding patient:", error);
            res.redirect("/staff/patients?message=ServerError");
        });
};

// Fetch Total Patients
const getTotalPatients = (req, res) => {
    models.Patient.count()
        .then(totalPatients => {
            res.json({ totalPatients });
        })
        .catch(error => {
            console.error('Error fetching total patients:', error);
            res.status(500).json({ error: 'Unable to fetch data' });
        });
};

// editPatient view 
const editPatient = (req, res) => {
    const patientId = req.params.id;
    models.Patient.findByPk(patientId)
        .then(patient => {
            if (patient) {
                res.render("staff/editPatientModal", { patient });
            } else {
                res.redirect("/staff/patients");
            }
        })
        .catch(error => {
            console.error("Error fetching patient:", error);
            res.redirect("/staff/patients");
        });
};


// Update Patient
const updatePatientStatus = (req, res) => {
    const { Patient_ID, Patient_Status } = req.body;

    models.Patient.update({ Patient_Status }, {
        where: { Patient_ID },
    })
    .then(() => {
        res.redirect("/staff/patients");
    })
    .catch(error => {
        console.error("Error updating patient status:", error);
        res.redirect("/staff/patients?message=UpdateError");
    });
};



//  (Delete) Patient
const deletePatient = (req, res) => {
    const patientId = req.params.id;

    models.Patient.destroy({
        where: { Patient_ID: patientId }
    })
    .then(() => {
        res.redirect("/staff/patients");
    })
    .catch(error => {
        console.error("Error deleting patient:", error);
        res.redirect("/staff/patients?message=DeleteError");
    });
};





module.exports = {
    Admindashboard_view,
    usermanagement_view,
    logs_view,
    Staffdashboard_view,
    patients_view,
    logout,
    save_addPatient,
    getTotalPatients ,
    editPatient,
    updatePatientStatus,
    deletePatient
    
};
