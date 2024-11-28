const express = require("express");
const userController = require("../controller/user.controller.js");
const addPatientController = require("../controller/addPatient.controller.js");
const appointmentController = require("../controller/appointment.controller.js");
const patientController = require("../controller/patient.controller.js");

const router = express.Router();

// Patient Routes

router.get("/patient/login", patientController.login_view); // Route to render the login page
router.post("/login-patient", patientController.loginPatient); // Route to handle login form submission


router.get("/patient/register", patientController.register_view); 


router.get("/patient/profile", patientController.profile_view); 
router.get("/patient/appointment", patientController.appointment_view); 
router.get("/patient/history", patientController.history_view);
router.get("/patient/logout", patientController.logout);

// New route for registering a patient
router.get("/register-patient", (req, res) => {
    res.render("patient/register");  // Render the registration form
});

router.post("/register-patient", patientController.registerPatient);  // Handle patient registration form submission

// Edit Profile - Display Form
router.get("/patient/edit", patientController.editProfile_view);

// Edit Profile - Handle Form Submission
router.post("/patient/edit", patientController.editProfile);


router.post("/add-appointment", patientController.addAppointment); // Handle new appointment submission

module.exports = router;
