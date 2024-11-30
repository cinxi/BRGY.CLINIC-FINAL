const express = require("express");
const userController = require("../controller/user.controller.js");
const addPatientController = require("../controller/addPatient.controller.js");
const appointmentController = require("../controller/appointment.controller.js");
const patientController = require("../controller/patient.controller.js");

const router = express.Router();

// Middleware to fetch and set patient details for routes
const fetchPatientDetails = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/patient/login");
    }

    try {
        const jwt = require("jsonwebtoken");
        const models = require("../models");
        const decoded = jwt.verify(token, "your_secret_key");

        const patient = await models.Patient.findOne({ where: { Patient_ID: decoded.id } });

        if (!patient) {
            return res.redirect("/patient/login");
        }

        res.locals.firstName = patient.Patient_FirstName || "N/A";
        res.locals.lastName = patient.Patient_LastName || "N/A";

        next();
    } catch (error) {
        console.error("Error fetching patient details:", error.message);
        res.redirect("/patient/login");
    }
};

// Patient Routes

router.get("/patient/landing", patientController.landing_view);

router.get("/patient/login", patientController.login_view);
router.post("/login-patient", patientController.loginPatient);

router.get("/patient/register", patientController.register_view);

router.get("/patient/profile", patientController.profile_view);
router.get("/patient/appointment", fetchPatientDetails, patientController.appointment_view);
router.get("/patient/history", fetchPatientDetails, patientController.history_view);
router.get("/patient/logout", patientController.logout);

router.get("/register-patient", (req, res) => {
    res.render("patient/register"); // Render the registration form
});
router.post("/register-patient", patientController.registerPatient);

router.get("/patient/edit", patientController.editProfile_view);
router.post("/patient/edit", patientController.editProfile);

router.post("/add-appointment", patientController.addAppointment);

router.post("/reschedule-appointment", patientController.rescheduleAppointment);
router.post("/cancel-appointment", patientController.cancelAppointment);




module.exports = router;
